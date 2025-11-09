# LegalEase Design Guidelines

## Design Approach
**Reference-Based Hybrid**: Drawing inspiration from **Stripe** (professional trust + clarity), **Linear** (modern minimalism), and **Notion** (clean information architecture). This combination creates a trustworthy legal platform that feels both professional and approachable.

## Color System
### Light Mode
- **Primary Navy**: `#1e3a8a` (headers, primary buttons, important text)
- **Soft Gold Accent**: `#f59e0b` (CTAs, highlights, success states)
- **Pure White**: `#ffffff` (backgrounds, cards)
- **Neutral Gray Scale**: `#f9fafb` (subtle backgrounds), `#6b7280` (secondary text), `#e5e7eb` (borders)

### Dark Mode
- **Deep Navy Background**: `#0f172a`
- **Card Surfaces**: `#1e293b`
- **Gold Accent**: `#fbbf24` (slightly brighter for contrast)
- **Text**: `#f1f5f9` (primary), `#94a3b8` (secondary)

## Typography
**Primary Font**: Inter (via Google Fonts CDN)
- **Hero/H1**: 48px (3xl on mobile), 700 weight, tight leading (-0.02em)
- **H2**: 36px, 600 weight
- **H3**: 24px, 600 weight
- **Body**: 16px, 400 weight, relaxed leading (1.6)
- **Small/Caption**: 14px, 400 weight
- **Legal Text/Fine Print**: 12px, 400 weight, `#6b7280`

## Layout System
**Container**: Max-width `1280px` with responsive padding (`px-4` mobile, `px-8` tablet, `px-12` desktop)

**Spacing Scale** (Tailwind units): Use **4, 6, 8, 12, 16, 20, 24** consistently
- Component padding: `p-6` or `p-8`
- Section spacing: `py-16` or `py-24`
- Card gaps: `gap-6` or `gap-8`
- Element margins: `mb-4`, `mt-6`, `mx-8`

## Component Library

### Navigation
- Fixed header with blur backdrop (`backdrop-blur-lg bg-white/90`)
- Logo left, main nav center, "Get Started" gold button + user avatar right
- Mobile: Hamburger menu with slide-in drawer
- Secondary nav for dashboard: Sidebar navigation (280px) with icons + labels

### Cards
- Rounded corners: `rounded-xl` (12px)
- Subtle shadow: `shadow-md hover:shadow-xl` transition
- White background in light mode, `#1e293b` in dark mode
- Internal padding: `p-6` or `p-8`

### Buttons
**Primary (Gold)**: Full gold background `#f59e0b`, white text, `rounded-lg`, `px-6 py-3`, medium font weight
**Secondary (Navy)**: Navy outline, navy text, transparent background
**Ghost**: No background, navy text, hover shows subtle gray background
**On Images**: White background with `backdrop-blur-md`, semi-transparent (`bg-white/80`)

### Forms & Inputs
- Input fields: `rounded-lg`, `border-2 border-gray-200`, `px-4 py-3`, focus state shows navy border
- Labels: 14px, 600 weight, navy color, `mb-2`
- Error states: Red border `#ef4444`, error text below
- File upload: Drag-and-drop zone with dashed border, icon, and "Browse files" link

### Lawyer Cards
- Horizontal layout on desktop: Avatar left (80px rounded-full), content middle, rating + book button right
- Includes: Name (H3), specialization badge (gold pill), location, experience years, ELO rating (chess-style display), online status indicator (green dot + "Available" or yellow "Busy")
- WhatsApp icon link + social media icons in footer

### Chat Interface
- Fixed chat container: Messages in scrollable area, input fixed at bottom
- User messages: Right-aligned, gold background, rounded corners
- AI messages: Left-aligned, light gray background, includes citation links
- Typing indicator: Three animated dots in AI message bubble

### Document Vault
- Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Document cards: File icon (based on type), filename, date, size, lock icon (encrypted indicator)
- Upload button: Large dashed border card with upload icon and text

## Images

### Hero Section (Landing Page)
**Large hero image**: Professional courtroom or diverse people consulting with lawyer (bright, optimistic). Image spans right 50% of hero on desktop, full-width with overlay on mobile. Dimensions: 1920x1080, modern photography style.

### Dashboard
**No large images**. Use icons (Heroicons) for quick actions and feature cards.

### Lawyer Profiles
**Profile photos**: Circular 200px professional headshots for detail pages, 80px for directory cards. Real professional photography style.

### About/Trust Sections
**Team photos**: 3-4 candid office/collaboration images (400x300), showing diversity and professionalism.

### Document Vault
**Icon-based**: Use document type icons (PDF, DOCX, etc.) from Heroicons, no photos.

## Iconography
**Heroicons** (outline style for most UI, solid for emphasis)
- Navigation, feature cards, buttons use 20px or 24px icons
- Consistent navy color in light mode, white in dark mode

## Animations
**Minimal and purposeful**:
- Page transitions: 200ms fade
- Card hover: Subtle lift with shadow change (300ms ease-out)
- Button states: 150ms color transitions
- Chat messages: Slide-in from bottom (200ms)
- Modal/drawer: Slide + fade (250ms)
- **No scroll animations, no parallax**

## Key Pages Layout

### Landing Page
1. **Hero**: Left content (headline, subheadline, dual CTA buttons) + right image (50/50 split desktop)
2. **Trust Bar**: Logo strip of legal institutions or "Trusted by X users" stat
3. **Features Grid**: 3 columns - AI Chat, Lawyer Directory, Document Vault with icons and descriptions
4. **How It Works**: 4-step horizontal timeline with numbers and short descriptions
5. **Lawyer Showcase**: 3 featured lawyer cards in horizontal carousel
6. **CTA Section**: Centered, gold background, white text, single focused message
7. **Footer**: Multi-column (Logo + About, Features, Legal, Contact)

### Dashboard
**Sidebar left** (280px): Navigation items with icons
**Main content area**: 
- Welcome header with user name
- Stats cards row (4 cards): Pending chats, Upcoming appointments, Documents stored, Active cases
- Quick actions grid (3 columns): Start new chat, Find lawyer, Upload document
- Recent activity list below

### Lawyer Directory
- Filter sidebar left (320px): Specialization, location, rating, availability checkboxes
- Main grid: 2-column lawyer cards, load more pagination

### Lawyer Profile
- Hero section: Large avatar left, name/credentials/ELO center, book appointment button right
- Tabs: About, Reviews, Availability, Contact
- Contact section includes WhatsApp click-to-chat button (green) and social media links

### Chat Interface
- Clean 2-column desktop: Conversation list sidebar (360px), active chat main area
- Mobile: Full-screen chat view with back button

### Document Vault
- Upload area at top (prominent dashed card)
- Grid of encrypted documents below with search/filter bar

## Accessibility
- WCAG AA contrast ratios minimum
- Focus states: 2px gold outline on all interactive elements
- Keyboard navigation: Full support with visible focus indicators
- Screen reader: Semantic HTML, ARIA labels on icons/buttons
- Form validation: Inline errors with icons and clear messaging