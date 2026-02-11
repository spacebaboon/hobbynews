# HobbyNews Extension Plan

This document outlines the implementation plan to transform HobbyNews from a static RSS aggregator into a full-featured, user-driven platform with authentication, personalization, and theming.

## Tech Stack Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Database | Supabase (Postgres) | Generous free tier, built-in auth, real-time, good DX |
| Auth | Supabase Auth | Google OAuth + Magic Link email |
| Deployment | Vercel | Native Next.js support, easy Supabase integration |
| ORM | Prisma | Type-safe queries, migrations, works with Supabase |
| Styling | Tailwind CSS (existing) | Keep current, extend with theme system |

---

## Phase 1: Infrastructure Setup

### 1.1 Switch Deployment to Vercel
**Complexity:** Low | **Dependencies:** None

- Remove Cloudflare-specific packages (`@opennextjs/cloudflare`, `wrangler`)
- Remove `wrangler.jsonc` and `open-next.config.ts`
- Update `next.config.mjs` for Vercel
- Create Vercel project and link repo
- Configure environment variables structure
- Update README with new deployment info

**Deliverables:**
- App deployed on Vercel
- CI/CD pipeline working
- Environment variables documented

---

### 1.2 Set Up Supabase Project
**Complexity:** Low | **Dependencies:** 1.1

- Create Supabase project
- Document connection strings and API keys
- Add Supabase client packages (`@supabase/supabase-js`, `@supabase/ssr`)
- Create `src/lib/supabase/client.ts` (browser client)
- Create `src/lib/supabase/server.ts` (server client)
- Create `src/lib/supabase/middleware.ts` (session refresh)
- Add environment variables to Vercel

**Deliverables:**
- Supabase project created
- Client utilities in place
- Connection verified

---

### 1.3 Set Up Prisma with Supabase
**Complexity:** Low | **Dependencies:** 1.2

- Install Prisma (`prisma`, `@prisma/client`)
- Initialize Prisma with PostgreSQL provider
- Configure `DATABASE_URL` for Supabase pooled connection
- Configure `DIRECT_URL` for migrations
- Create initial schema (empty, structure only)
- Set up migration workflow
- Add Prisma generate to build script

**Deliverables:**
- Prisma configured
- Migration workflow documented
- `prisma/schema.prisma` base file

---

## Phase 2: Authentication

### 2.1 Database Schema for Users
**Complexity:** Low | **Dependencies:** 1.3

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  subscriptions UserFeedSubscription[]
  categories    UserCategory[]
  customFeeds   UserCustomFeed[]
  preferences   UserPreferences?
}

model UserPreferences {
  id          String  @id @default(uuid())
  userId      String  @unique
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  themeId     String?
  customTheme Json?   // Custom color overrides
}
```

- Create migration
- Generate Prisma client
- Test connection

**Deliverables:**
- Users table in database
- UserPreferences table
- Migration applied

---

### 2.2 Supabase Auth Configuration
**Complexity:** Medium | **Dependencies:** 2.1

- Enable Google OAuth provider in Supabase dashboard
- Configure Google Cloud OAuth credentials
- Enable Magic Link email provider
- Configure email templates
- Set up auth callback URL (`/auth/callback`)
- Configure redirect URLs for Vercel preview/production

**Deliverables:**
- Google OAuth working
- Magic Link working
- Callback route configured

---

### 2.3 Auth UI Components
**Complexity:** Medium | **Dependencies:** 2.2

- Create `src/components/auth/LoginButton.tsx`
- Create `src/components/auth/LoginModal.tsx` (Google + email input for magic link)
- Create `src/components/auth/UserMenu.tsx` (avatar dropdown with logout)
- Create `src/app/auth/callback/route.ts` (OAuth callback handler)
- Create `src/hooks/useUser.ts` (auth state hook)
- Add login/user menu to FeedHeader

**Deliverables:**
- Login modal with Google + Magic Link options
- User menu with avatar and logout
- Auth state management
- Session persistence

---

### 2.4 Protected Routes & Middleware
**Complexity:** Low | **Dependencies:** 2.3

- Create `src/middleware.ts` for session refresh
- Create utility to check auth status
- Define which routes require auth (feeds, themes, custom feeds)
- Public routes remain accessible without login

**Deliverables:**
- Middleware handling sessions
- Route protection logic
- Graceful handling of unauthenticated users

---

## Phase 3: Feed Gallery & Management

### 3.1 Database Schema for Feeds
**Complexity:** Medium | **Dependencies:** 2.1

```prisma
model FeedSource {
  id          String   @id @default(uuid())
  url         String   @unique
  name        String
  description String?
  siteUrl     String?
  iconUrl     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Moderation
  status      FeedStatus @default(PENDING)
  submittedBy String?    // User ID who submitted
  approvedBy  String?    // Admin who approved

  // Relations
  topics      FeedTopic[]
  subscribers UserFeedSubscription[]
}

model Topic {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?
  iconName    String?  // Lucide icon name
  sortOrder   Int      @default(0)

  feeds       FeedTopic[]
}

model FeedTopic {
  feedId  String
  topicId String
  feed    FeedSource @relation(fields: [feedId], references: [id], onDelete: Cascade)
  topic   Topic      @relation(fields: [topicId], references: [id], onDelete: Cascade)

  @@id([feedId, topicId])
}

enum FeedStatus {
  PENDING
  APPROVED
  REJECTED
}
```

- Create migration
- Seed existing feeds from `config/feeds.ts` into database

**Deliverables:**
- FeedSource, Topic, FeedTopic tables
- Existing feeds migrated to database
- Seed script

---

### 3.2 Feed Gallery Page
**Complexity:** Medium | **Dependencies:** 3.1

- Create `src/app/gallery/page.tsx`
- Display topics as cards/sections
- Show feeds within each topic
- Include feed metadata (name, description, site URL)
- Add "Subscribe" button for logged-in users
- Show subscription count per feed
- Search/filter functionality

**Deliverables:**
- `/gallery` page
- Topic browsing
- Feed discovery UI

---

### 3.3 User Feed Subscriptions
**Complexity:** Medium | **Dependencies:** 3.2

```prisma
model UserFeedSubscription {
  id         String   @id @default(uuid())
  userId     String
  feedId     String
  categoryId String?  // User's custom category
  createdAt  DateTime @default(now())

  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  feed     FeedSource    @relation(fields: [feedId], references: [id], onDelete: Cascade)
  category UserCategory? @relation(fields: [categoryId], references: [id])

  @@unique([userId, feedId])
}
```

- Create subscription toggle API (`POST /api/subscriptions`)
- Create hook `useSubscription(feedId)`
- Update gallery UI with subscription state
- Show "Subscribed" indicator

**Deliverables:**
- Subscription toggle working
- Subscription state in UI
- Database persistence

---

### 3.4 User Custom Categories
**Complexity:** Medium | **Dependencies:** 3.3

```prisma
model UserCategory {
  id        String   @id @default(uuid())
  userId    String
  name      String
  slug      String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  user  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  feeds UserFeedSubscription[]

  @@unique([userId, slug])
}
```

- Create category management API (`/api/categories`)
- Create `src/components/CategoryManager.tsx`
- Allow create, rename, reorder, delete categories
- Drag-and-drop reordering (optional, can be phase 2)
- Assign feeds to categories

**Deliverables:**
- Category CRUD API
- Category management UI
- Feed-to-category assignment

---

### 3.5 User Custom Feed URLs
**Complexity:** Medium | **Dependencies:** 3.4

```prisma
model UserCustomFeed {
  id         String   @id @default(uuid())
  userId     String
  url        String
  name       String
  categoryId String?
  createdAt  DateTime @default(now())

  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  category UserCategory? @relation(fields: [categoryId], references: [id])

  @@unique([userId, url])
}
```

- Create custom feed API (`/api/custom-feeds`)
- Create `src/components/AddCustomFeed.tsx`
- Validate RSS URL before saving (fetch and parse)
- Auto-detect feed name from RSS metadata
- Allow assigning to category

**Deliverables:**
- Custom feed addition form
- URL validation
- Custom feeds in user's view

---

### 3.6 Community Feed Submissions
**Complexity:** Medium | **Dependencies:** 3.1

- Create `src/app/gallery/submit/page.tsx`
- Form: URL, name, description, suggested topic(s)
- Validate feed URL
- Save as PENDING status
- Email notification to admin (optional)
- Show "Pending Review" status to submitter

**Deliverables:**
- Feed submission form
- Pending feed storage
- Submission confirmation

---

### 3.7 Admin Feed Moderation
**Complexity:** Medium | **Dependencies:** 3.6

- Create `src/app/admin/feeds/page.tsx`
- List pending submissions
- Approve/reject with optional note
- Edit feed metadata before approval
- Admin-only access (check user role)
- Add `isAdmin` field to User model

**Deliverables:**
- Admin moderation page
- Approve/reject workflow
- Admin role check

---

## Phase 4: Personalized Feed View

### 4.1 Refactor Feed Loading for Users
**Complexity:** High | **Dependencies:** 3.5

- Modify `src/utils/rss.ts` to accept dynamic feed list
- Create `src/utils/server/userFeeds.ts` to load user's feeds
- Logic: subscribed gallery feeds + custom feeds
- Fallback to default feeds for anonymous users
- Handle empty subscription state

**Deliverables:**
- Dynamic feed loading based on user
- Anonymous fallback
- Server-side feed resolution

---

### 4.2 Update Home Page for Personalization
**Complexity:** Medium | **Dependencies:** 4.1

- Modify `src/app/page.tsx` to check auth
- Load user-specific feeds if logged in
- Show user's categories in theme selector
- Keep current behavior for anonymous users
- Add "Customize" CTA for logged-in users with no subscriptions

**Deliverables:**
- Personalized home feed
- User categories as themes
- Seamless anonymous experience

---

### 4.3 User Settings Page
**Complexity:** Medium | **Dependencies:** 4.2

- Create `src/app/settings/page.tsx`
- Sections: Profile, Subscriptions, Categories, Custom Feeds, Theme
- Profile: name, avatar (from OAuth)
- Subscriptions: list with unsubscribe
- Categories: manage with drag-drop
- Custom feeds: list with edit/delete
- Theme: selector (see Phase 5)

**Deliverables:**
- `/settings` page
- All user preferences manageable
- Organized settings UI

---

## Phase 5: Theming System

### 5.1 Theme Database Schema
**Complexity:** Low | **Dependencies:** 2.1

```prisma
model Theme {
  id          String  @id @default(uuid())
  name        String  @unique
  slug        String  @unique
  isDefault   Boolean @default(false)
  isPublic    Boolean @default(true)

  // Colors (stored as hex)
  primaryColor     String
  secondaryColor   String
  backgroundColor  String
  surfaceColor     String
  textColor        String
  textMutedColor   String
  accentColor      String
  borderColor      String
}
```

- Create migration
- Seed default themes (Light, Dark, Nord, Dracula, Solarized, etc.)

**Deliverables:**
- Theme table
- Default themes seeded

---

### 5.2 Theme Provider & CSS Variables
**Complexity:** Medium | **Dependencies:** 5.1

- Create `src/components/ThemeProvider.tsx`
- Load theme from user preferences or localStorage
- Apply theme via CSS custom properties
- Update Tailwind config to use CSS variables
- Support system preference detection (dark mode)

**Deliverables:**
- ThemeProvider context
- CSS variable application
- Tailwind integration

---

### 5.3 Theme Selector UI
**Complexity:** Medium | **Dependencies:** 5.2

- Create `src/components/ThemeSelector.tsx`
- Preview thumbnails for each theme
- Apply theme on selection
- Save preference to database for logged-in users
- Save to localStorage for anonymous users

**Deliverables:**
- Theme selector component
- Persistent theme selection
- Preview functionality

---

### 5.4 Custom Theme Builder
**Complexity:** High | **Dependencies:** 5.3

- Create `src/app/settings/theme/page.tsx`
- Color pickers for each theme property
- Live preview
- Save as custom theme in UserPreferences.customTheme
- Reset to default option

**Deliverables:**
- Custom theme builder UI
- Color picker integration
- Live preview
- Save/reset functionality

---

## Phase 6: Heading and Menu Rework

### 6.1: Heading Rework
**Complexity:** Low | **Dependencies:** 5.4

- Remove current top left icon
- Remove menu items under profile name, leave only 'Sign out'
- Remove '[chosen category]/All Feed' display - already indicated by the selected category
- Remove reload icon from header (moves to menu)
- Add main heading for app name: Hobby News
- Move category selector (All, Tech, Gaming, etc.) to horizontal bar below header

**Deliverables:**
- Cleaner header area
- Category bar below header


### 6.2: New hamburger menu
**Complexity:** Low | **Dependencies:** 6.1

- Add open menu icon in top left, with 'hamburger' icon
- Clicking icon opens / closes animated open/close menu panel on left side
- Menu items for all users:
  - "Reload" - refreshes feeds
  - "Themes" → `/themes`
- Menu items for logged-in users only:
  - "Feeds" → `/feeds`
- Menu items for anonymous users only:
  - "Sign up for custom feeds and categories" - opens sign in/up modal

**Deliverables:**
- LHS menu
- Improved structure of routes


### 6.3: Feed Management screen (`/feeds`)
**Complexity:** Low | **Dependencies:** 6.2

- Combine feeds, custom feeds, subscriptions, and categories into one screen
- Make the previous feed subscription cards smaller, remove RSS icon
- Remove old `/settings` route and related components
- Remove old `/gallery` route (replaced by `/feeds`)

**Deliverables:**
- Unified management of same concepts at `/feeds`


### 6.4: Theme screen (`/themes`)
**Complexity:** Low | **Dependencies:** 6.2

- Move theme selector and custom theme builder to `/themes`
- Remove old `/settings/theme` route

**Deliverables:**
- Theme management at `/themes`

---

## Phase 7: Polish & Optimization

### 7.1 Loading States & Skeleton UI
**Complexity:** Low | **Dependencies:** 4.2

- Enhance existing loading.tsx
- Add skeleton states for feeds page
- Add skeleton states for themes page
- Smooth transitions between states

**Deliverables:**
- Consistent loading experience
- Skeleton components

---

### 7.2 Error Handling & Validation
**Complexity:** Low | **Dependencies:** All

- Form validation with error messages
- API error handling
- User-friendly error pages
- Feed fetch failure handling

**Deliverables:**
- Robust error handling
- Clear error messages

---

### 7.3 Performance Optimization
**Complexity:** Medium | **Dependencies:** All

- Implement feed caching strategy
- Consider Redis/Upstash for feed cache
- Optimize database queries
- Add appropriate indexes
- Lazy load gallery images

**Deliverables:**
- Improved load times
- Efficient data fetching

---

### 7.4 Testing
**Complexity:** Medium | **Dependencies:** All

- Unit tests for utilities
- Component tests for key UI
- Integration tests for auth flow
- API route tests

**Deliverables:**
- Test coverage for critical paths
- CI test pipeline

---

## Implementation Order Summary

```
Phase 1: Infrastructure (1-2 days)
├── 1.1 Vercel deployment
├── 1.2 Supabase setup
└── 1.3 Prisma setup

Phase 2: Authentication (2-3 days)
├── 2.1 User schema
├── 2.2 Auth configuration
├── 2.3 Auth UI
└── 2.4 Protected routes

Phase 3: Feed Management (4-5 days)
├── 3.1 Feed schema
├── 3.2 Gallery page
├── 3.3 Subscriptions
├── 3.4 Custom categories
├── 3.5 Custom feeds
├── 3.6 Community submissions
└── 3.7 Admin moderation

Phase 4: Personalization (2-3 days)
├── 4.1 Dynamic feed loading
├── 4.2 Personalized home
└── 4.3 Settings page

Phase 5: Theming
├── 5.1 Theme schema
├── 5.2 Theme provider
├── 5.3 Theme selector
└── 5.4 Custom theme builder

Phase 6: Heading and Menu Rework
├── 6.1 Heading rework
├── 6.2 Hamburger menu
├── 6.3 Feed management screen (/feeds)
└── 6.4 Theme screen (/themes)

Phase 7: Polish
├── 7.1 Loading states
├── 7.2 Error handling
├── 7.3 Performance
└── 7.4 Testing
```

---

## Database Schema (Complete)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  avatarUrl String?
  isAdmin   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  subscriptions UserFeedSubscription[]
  categories    UserCategory[]
  customFeeds   UserCustomFeed[]
  preferences   UserPreferences?
}

model UserPreferences {
  id          String  @id @default(uuid())
  userId      String  @unique
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  themeId     String?
  theme       Theme?  @relation(fields: [themeId], references: [id])
  customTheme Json?
}

model Theme {
  id               String  @id @default(uuid())
  name             String  @unique
  slug             String  @unique
  isDefault        Boolean @default(false)
  isPublic         Boolean @default(true)
  primaryColor     String
  secondaryColor   String
  backgroundColor  String
  surfaceColor     String
  textColor        String
  textMutedColor   String
  accentColor      String
  borderColor      String

  userPreferences UserPreferences[]
}

model FeedSource {
  id          String     @id @default(uuid())
  url         String     @unique
  name        String
  description String?
  siteUrl     String?
  iconUrl     String?
  status      FeedStatus @default(PENDING)
  submittedBy String?
  approvedBy  String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  topics      FeedTopic[]
  subscribers UserFeedSubscription[]
}

model Topic {
  id          String  @id @default(uuid())
  name        String  @unique
  slug        String  @unique
  description String?
  iconName    String?
  sortOrder   Int     @default(0)

  feeds FeedTopic[]
}

model FeedTopic {
  feedId  String
  topicId String
  feed    FeedSource @relation(fields: [feedId], references: [id], onDelete: Cascade)
  topic   Topic      @relation(fields: [topicId], references: [id], onDelete: Cascade)

  @@id([feedId, topicId])
}

model UserFeedSubscription {
  id         String   @id @default(uuid())
  userId     String
  feedId     String
  categoryId String?
  createdAt  DateTime @default(now())

  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  feed     FeedSource    @relation(fields: [feedId], references: [id], onDelete: Cascade)
  category UserCategory? @relation(fields: [categoryId], references: [id])

  @@unique([userId, feedId])
}

model UserCategory {
  id        String   @id @default(uuid())
  userId    String
  name      String
  slug      String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  user  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  feeds UserFeedSubscription[]

  @@unique([userId, slug])
}

model UserCustomFeed {
  id         String   @id @default(uuid())
  userId     String
  url        String
  name       String
  categoryId String?
  createdAt  DateTime @default(now())

  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  category UserCategory? @relation(fields: [categoryId], references: [id])

  @@unique([userId, url])
}

enum FeedStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## API Routes Overview

| Route | Method | Description | Auth |
|-------|--------|-------------|------|
| `/api/subscriptions` | GET | List user subscriptions | Required |
| `/api/subscriptions` | POST | Subscribe to feed | Required |
| `/api/subscriptions/[id]` | DELETE | Unsubscribe | Required |
| `/api/categories` | GET | List user categories | Required |
| `/api/categories` | POST | Create category | Required |
| `/api/categories/[id]` | PATCH | Update category | Required |
| `/api/categories/[id]` | DELETE | Delete category | Required |
| `/api/custom-feeds` | GET | List custom feeds | Required |
| `/api/custom-feeds` | POST | Add custom feed | Required |
| `/api/custom-feeds/[id]` | DELETE | Remove custom feed | Required |
| `/api/feeds/submit` | POST | Submit feed for approval | Required |
| `/api/admin/feeds` | GET | List pending feeds | Admin |
| `/api/admin/feeds/[id]/approve` | POST | Approve feed | Admin |
| `/api/admin/feeds/[id]/reject` | POST | Reject feed | Admin |
| `/api/themes` | GET | List public themes | Public |
| `/api/user/preferences` | GET | Get user preferences | Required |
| `/api/user/preferences` | PATCH | Update preferences | Required |

---

## File Structure (Target)

```
src/
├── app/
│   ├── page.tsx                    # Home (personalized if logged in)
│   ├── layout.tsx                  # Root layout with providers
│   ├── globals.css
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts            # OAuth callback
│   ├── feeds/
│   │   └── page.tsx                # Feed management (subscriptions, custom feeds, categories)
│   ├── themes/
│   │   └── page.tsx                # Theme selector and custom theme builder
│   ├── admin/
│   │   └── feeds/
│   │       └── page.tsx            # Feed moderation
│   └── api/
│       ├── subscriptions/
│       ├── categories/
│       ├── custom-feeds/
│       ├── feeds/
│       ├── admin/
│       ├── themes/
│       └── user/
├── components/
│   ├── auth/
│   │   ├── LoginButton.tsx
│   │   ├── LoginModal.tsx
│   │   └── UserMenu.tsx
│   ├── feed/
│   │   ├── FeedViewer.tsx
│   │   ├── FeedHeader.tsx
│   │   ├── FeedSidebar.tsx
│   │   └── ArticleCard.tsx
│   ├── feeds/
│   │   ├── FeedCard.tsx
│   │   ├── CategoryManager.tsx
│   │   └── CustomFeedList.tsx
│   ├── menu/
│   │   └── HamburgerMenu.tsx
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeSelector.tsx
│   │   └── ThemeBuilder.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── ...
├── hooks/
│   ├── useUser.ts
│   ├── useSubscription.ts
│   └── useTheme.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── prisma.ts
├── utils/
│   ├── rss.ts
│   └── server/
│       ├── feedLoader.ts
│       └── userFeeds.ts
└── types.ts
```

---

## Notes for Agent Execution

Each task above is designed to be completable by an AI agent in a single session. When executing:

1. **Follow the dependency order** - Don't start a task until dependencies are complete
2. **Test after each task** - Verify the feature works before moving on
3. **Commit after each task** - Keep commits atomic and well-described
4. **Update this plan** - Mark tasks complete as you go

### Task Completion Checklist

For each task, ensure:
- [ ] Code is written and compiles without errors
- [ ] Types are correct (no `any` unless unavoidable)
- [ ] Basic error handling is in place
- [ ] Feature is manually testable
- [ ] Commit is made with descriptive message
