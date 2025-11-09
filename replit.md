# LegalEase - AI-Powered Legal Aid Platform

## Overview

LegalEase is a comprehensive legal assistance platform that combines AI-powered legal guidance, lawyer marketplace, and secure document storage. The platform uses Google's Gemini 2.5 Flash API to provide country-specific legal assistance through an intelligent chatbot, while enabling users to connect with verified lawyers and securely store sensitive legal documents.

**Core Features:**
- AI chatbot with country-specific legal knowledge and RAG-based retrieval
- Lawyer marketplace with booking system and real-time messaging
- Encrypted document vault with zero-knowledge architecture
- Multi-language and multi-country support
- Role-based access (users and lawyers)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and dev server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS with shadcn/ui component library
- WebSocket integration for real-time messaging

**Design System:**
- Theme: "New York" style from shadcn/ui
- Color system: Professional navy primary (#1e3a8a), gold accents (#f59e0b)
- Typography: Inter font family via Google Fonts
- Dark mode support through ThemeProvider context
- Design inspired by Stripe, Linear, and Notion (see design_guidelines.md)

**Component Architecture:**
- Atomic design pattern with reusable UI components in `/client/src/components/ui`
- Feature-specific components (ChatInterface, LawyerCard, DocumentVault)
- Shared components (AppSidebar, ThemeToggle, CountrySelector, LanguageSelector)
- Page-level components in `/client/src/pages`

**State Management:**
- TanStack Query for API data fetching and caching
- Custom hooks (useAuth, useIsMobile, useTheme) for shared logic
- WebSocket state managed via refs in component local state

**Routing Strategy:**
- Client-side routing with Wouter
- Role-based route protection (user vs lawyer dashboards)
- Onboarding flow for new users (RoleSelection → LawyerOnboarding for lawyers)
- Authenticated routes require login via Replit Auth

### Backend Architecture

**Technology Stack:**
- Node.js with Express
- TypeScript with ES modules
- Drizzle ORM for database operations
- Replit Auth (OpenID Connect) for authentication
- Socket.IO for real-time WebSocket messaging
- Session storage with connect-pg-simple

**API Design:**
- RESTful endpoints under `/api` prefix
- Authentication middleware (isAuthenticated) protects routes
- Type-safe request/response using shared schema definitions
- Centralized error handling with appropriate HTTP status codes

**Authentication Flow:**
- Replit Auth integration via OpenID Connect (OIDC)
- Passport.js strategy for session management
- PostgreSQL-backed session store (7-day TTL)
- User table mandatory for Replit Auth (includes id, email, profile fields)
- Role-based access control (user/lawyer roles)

**Real-time Messaging:**
- WebSocket server via Socket.IO attached to HTTP server
- Room-based messaging (booking-specific rooms)
- Online status tracking for lawyers
- Message persistence to database via storage layer

**Data Access Layer:**
- Storage abstraction (IStorage interface) in server/storage.ts
- DatabaseStorage implementation using Drizzle ORM
- Operations for users, lawyer profiles, bookings, and messages
- Filtered queries for lawyer directory (by specialization, country, status)

### Data Storage

**Database:**
- PostgreSQL via Neon serverless (@neondatabase/serverless)
- Connection pooling for performance
- WebSocket-based protocol (neonConfig.webSocketConstructor = ws)

**Schema Design (shared/schema.ts):**

1. **sessions** table - Session storage (mandatory for Replit Auth)
   - sid (primary key), sess (jsonb), expire (timestamp)

2. **users** table - User accounts (mandatory for Replit Auth)
   - id (UUID), email, firstName, lastName, profileImageUrl
   - role field for access control ("user" or "lawyer")
   - Timestamps for createdAt/updatedAt

3. **lawyerProfiles** table - Extended lawyer information
   - References users.id with cascade delete
   - Fields: specialization, location, country, experience, barNumber
   - Rating/review metrics, pricing, languages array
   - Status fields (isOnline, status: available/busy/offline)
   - ELO rating system for lawyer ranking

4. **bookings** table - Consultation appointments
   - References userId and lawyerId (both to users table)
   - Consultation type (chat/video/phone), status, dates, budget
   - Case description and notes

5. **messages** table - Chat messages
   - References bookingId and senderId
   - Message content, timestamps, read status

**Database Tooling:**
- Drizzle Kit for schema migrations (drizzle.config.ts)
- Type-safe schema definitions with drizzle-zod
- Migration files output to ./migrations directory

**Encryption Strategy:**
- Client-side AES-256 encryption for document vault (planned)
- Zero-knowledge architecture (server never sees decryption keys)
- Password-derived keys with multi-factor authentication

### External Dependencies

**AI/ML Services:**
- **Google Gemini API** (@google/genai v1.29.0)
  - Model: Gemini 2.5 Flash
  - Purpose: AI chatbot for legal Q&A
  - RAG implementation planned for country-specific legal knowledge
  - Citation-ready responses with legal references

**Authentication:**
- **Replit Auth** (OpenID Connect)
  - Issuer URL: process.env.ISSUER_URL (default: https://replit.com/oidc)
  - Required env vars: REPL_ID, SESSION_SECRET
  - Passport.js integration via openid-client

**Database:**
- **Neon PostgreSQL** (serverless)
  - Connection: process.env.DATABASE_URL
  - WebSocket-based protocol for serverless compatibility
  - Managed connection pooling

**UI Component Library:**
- **Radix UI** primitives (v1.x+)
  - Accordion, Dialog, Dropdown, Popover, Toast, etc.
  - Accessible components with keyboard navigation
  - Headless components styled with Tailwind

**Form Management:**
- **React Hook Form** with Zod validation
  - @hookform/resolvers for schema integration
  - Type-safe forms using drizzle-zod schemas

**Styling:**
- **Tailwind CSS** v3.x
  - Custom color system via CSS variables
  - Dark mode via class-based strategy
  - shadcn/ui design tokens

**Real-time Communication:**
- **Socket.IO** (planned expansion)
  - WebSocket fallback support
  - Room-based messaging
  - Typing indicators and presence

**Planned Integrations:**
- Legal API databases (OpenLaws API for legal documents)
- IPFS for decentralized document storage
- Video/chat SDKs for consultations
- Payment gateways (Stripe/Razorpay)
- Multi-language translation APIs

**Development Tools:**
- Vite plugins: runtime error modal, dev banner, cartographer (Replit-specific)
- ESBuild for server bundling
- TypeScript strict mode with path aliases (@/, @shared, @assets)