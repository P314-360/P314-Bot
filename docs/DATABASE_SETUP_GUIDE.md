# Database Setup Guide for P314

## Overview

P314 uses **MongoDB** for all data persistence. Follow this guide to connect a real MongoDB instance and initialize the schema.

---

## Supported Database Providers

### Option 1: MongoDB Atlas (Recommended)
- Free tier (M0) available at https://cloud.mongodb.com
- Managed, scalable, and production-ready
- Built-in monitoring and backups

### Option 2: Self-Hosted MongoDB
- MongoDB Community Edition 6.0+
- Full control over infrastructure

---

## Setup Steps

### 1. Create a MongoDB Cluster

Sign up at https://cloud.mongodb.com, create a new **M0 Free** cluster, then:
- Create a database user with read/write access
- Add your IP address (or `0.0.0.0/0` for Vercel) to the network access allowlist

### 2. Get Your Connection String

In Atlas → Connect → Drivers, copy the connection string:
```
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/p314?retryWrites=true&w=majority
```

### 3. Add Environment Variables in Vercel

In the **Vars** section of the Vercel project settings, add:
```
MONGODB_URI=your_connection_string_here
MONGODB_DB_NAME=p314_bot
```

### 4. Initialize Collections and Indexes

Run the access-control setup script once after your first deployment:
```bash
MONGODB_URI=<your_uri> node scripts/03-mongodb-access-control.js
```

This creates all collections with their indexes (including TTL indexes for ephemeral channel messages).

### 5. Test Connection

After setting `MONGODB_URI`, restart the app or trigger a redeployment on Vercel. The server logs will show:
```
[P314 DB] ✓ Connection successful
```

---

## Security Notes

- Never commit `.env.local` to git (already in `.gitignore`)
- Use the MongoDB Atlas built-in user roles instead of root credentials
- Enable MongoDB Atlas IP allowlisting for production
- Regularly rotate database user passwords

## Troubleshooting

**Connection timeout:** Verify IP allowlist in MongoDB Atlas includes Vercel's egress IPs (or use `0.0.0.0/0` for serverless).  
**Authentication failed:** Double-check the username, password, and database name in the URI.  
**Collections missing:** Re-run `scripts/03-mongodb-access-control.js`.

## Current Mock Implementation

Until `MONGODB_URI` is configured, some routes fall back to in-memory stores. Features work in development but data is not persisted between restarts.
