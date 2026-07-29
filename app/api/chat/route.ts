import { type NextRequest, NextResponse } from "next/server"

// Mock AI responses based on question patterns
function generateAIResponse(message: string, userId?: string): string | { message: string; referralData?: any } {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.startsWith("/share") || lowerMessage.includes("رابط الإحالة")) {
    return {
      message:
        "جاري إنشاء رابط الإحالة الخاص بك... سيتم عرض الرابط في لوحة التحكم الخاصة بك. يمكنك أيضاً العثور عليه في قسم 'الإحالات' في ملفك الشخصي.",
      referralData: { action: "generate_link", userId },
    }
  }

  // Pi Network related questions
  if (lowerMessage.includes("pi network") || lowerMessage.includes("pi coin")) {
    return "Pi Network is a cryptocurrency project that allows users to mine Pi coins on their mobile devices. It aims to create an accessible digital currency for everyday users."
  }

  // Security related questions
  if (lowerMessage.includes("security") || lowerMessage.includes("fraud") || lowerMessage.includes("scam")) {
    return "P314 provides advanced security features including AI-powered fraud detection, encrypted communications, and reputation-based trust scoring to protect Pi Network users from scams and fraudulent activities."
  }

  // NFT related questions
  if (lowerMessage.includes("nft") || lowerMessage.includes("reputation")) {
    return "P314 converts your achievements and positive community contributions into Reputation NFTs, which can generate passive income and demonstrate your trustworthiness in the Pi Network ecosystem."
  }

  // KYC related questions
  if (lowerMessage.includes("kyc") || lowerMessage.includes("verification")) {
    return "P314 uses hybrid encrypted KYC verification to protect your identity while ensuring compliance with Pi Network requirements. Your personal data is encrypted and never shared without your consent."
  }

  // General greetings
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("مرحبا") ||
    lowerMessage.includes("السلام")
  ) {
    return "مرحباً بك في P314! كيف يمكنني مساعدتك اليوم؟"
  }

  // Help requests
  if (lowerMessage.includes("help") || lowerMessage.includes("مساعدة")) {
    return "يمكنني مساعدتك في معرفة المزيد عن P314، بما في ذلك ميزات الأمان، NFTs السمعة، التحقق من الهوية، وحماية من الاحتيال. ما الذي تود معرفته؟"
  }

  // Default response
  return `شكراً لسؤالك عن "${message}". P314 هي منصة أمان لامركزية لشبكة Pi Network توفر حماية فورية من الاحتيال باستخدام الذكاء الاصطناعي، ودعم مشفر للتحقق من الهوية، وتحويل الإنجازات إلى NFTs السمعة للحصول على دخل سلبي من المجتمع.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, audio, image, userId } = body

    // Validate request
    if (!message && !audio && !image) {
      return NextResponse.json({ error: "Message, audio, or image required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const aiResponse = generateAIResponse(message || "[Voice/Image message]", userId)

    if (typeof aiResponse === "object" && aiResponse.referralData) {
      return NextResponse.json({
        messages: [
          {
            id: Date.now().toString(),
            text: message,
            sender: "user",
            timestamp: new Date().toISOString(),
          },
          {
            id: (Date.now() + 1).toString(),
            text: aiResponse.message,
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ],
        specialAction: aiResponse.referralData,
      })
    }

    // Return response in expected format
    return NextResponse.json({
      messages: [
        {
          id: Date.now().toString(),
          text: message || "[Voice/Image message]",
          sender: "user",
          timestamp: new Date().toISOString(),
        },
        {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: "ai",
          timestamp: new Date().toISOString(),
        },
      ],
      community_awareness_score: Math.floor(Math.random() * 100),
      question_category: "General",
      asked_count: Math.floor(Math.random() * 50),
      trending_rank: Math.floor(Math.random() * 10) + 1,
      related_questions: ["What is Pi Network?", "How does P314 protect users?", "What are Reputation NFTs?"],
      awareness_justification: "Based on community activity and question patterns",
      confidence_score: 85 + Math.floor(Math.random() * 15),
      is_verified: true,
      is_rumor: false,
      sources: ["P314 Documentation", "Pi Network Official"],
      confidence_explanation: "Information verified from official sources",
      confidence_score_justification: "High confidence based on multiple reliable sources",
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
