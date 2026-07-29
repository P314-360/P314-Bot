export class E2EEManager {
  private keyPair: CryptoKeyPair | null = null
  private sharedSecrets: Map<string, CryptoKey> = new Map()

  async generateKeyPair(): Promise<void> {
    try {
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"],
      )
    } catch (error) {
      console.error("[P314] Failed to generate key pair:", error)
      throw error
    }
  }

  async exportPublicKey(): Promise<string> {
    if (!this.keyPair?.publicKey) {
      throw new Error("Key pair not initialized")
    }

    const exported = await window.crypto.subtle.exportKey("spki", this.keyPair.publicKey)
    const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)))
    return base64
  }

  async importPublicKey(base64Key: string): Promise<CryptoKey> {
    const binary = atob(base64Key)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    return await window.crypto.subtle.importKey(
      "spki",
      bytes.buffer,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      [],
    )
  }

  async deriveSharedSecret(recipientPublicKey: CryptoKey, userId: string): Promise<void> {
    if (!this.keyPair?.privateKey) {
      throw new Error("Key pair not initialized")
    }

    const sharedSecret = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: recipientPublicKey,
      },
      this.keyPair.privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    )

    this.sharedSecrets.set(userId, sharedSecret)
  }

  async encryptMessage(message: string, recipientUserId: string): Promise<string> {
    const sharedSecret = this.sharedSecrets.get(recipientUserId)
    if (!sharedSecret) {
      throw new Error("No shared secret for recipient")
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      sharedSecret,
      data,
    )

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encrypted), iv.length)

    return btoa(String.fromCharCode(...combined))
  }

  async decryptMessage(encryptedMessage: string, senderUserId: string): Promise<string> {
    const sharedSecret = this.sharedSecrets.get(senderUserId)
    if (!sharedSecret) {
      throw new Error("No shared secret for sender")
    }

    const binary = atob(encryptedMessage)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const iv = bytes.slice(0, 12)
    const data = bytes.slice(12)

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      sharedSecret,
      data,
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  }

  clearAllKeys(): void {
    this.keyPair = null
    this.sharedSecrets.clear()
  }
}

// Singleton instance
let e2eeInstance: E2EEManager | null = null

export const getE2EEManager = (): E2EEManager => {
  if (!e2eeInstance) {
    e2eeInstance = new E2EEManager()
  }
  return e2eeInstance
}

// Ephemeral message tracking (RAM only)
export class EphemeralMessageStore {
  private messages: Map<string, { content: string; timestamp: number; ttl: number }> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(cleanupIntervalMs = 5000) {
    // Start automatic cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, cleanupIntervalMs)
  }

  addMessage(messageId: string, content: string, ttlSeconds = 30): void {
    this.messages.set(messageId, {
      content,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  getMessage(messageId: string): string | null {
    const msg = this.messages.get(messageId)
    if (!msg) return null

    // Check if expired
    if (Date.now() - msg.timestamp > msg.ttl) {
      this.messages.delete(messageId)
      return null
    }

    return msg.content
  }

  deleteMessage(messageId: string): void {
    this.messages.delete(messageId)
  }

  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    this.messages.forEach((msg, id) => {
      if (now - msg.timestamp > msg.ttl) {
        toDelete.push(id)
      }
    })

    toDelete.forEach((id) => this.messages.delete(id))

    console.log(`[P314] Ephemeral cleanup: ${toDelete.length} messages deleted`)
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.messages.clear()
  }

  getMessageCount(): number {
    return this.messages.size
  }
}

let ephemeralStore: EphemeralMessageStore | null = null

export const getEphemeralStore = (): EphemeralMessageStore => {
  if (!ephemeralStore) {
    ephemeralStore = new EphemeralMessageStore()
  }
  return ephemeralStore
}
