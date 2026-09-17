# Unora — Frontend Build Spec

### Complete frontend scope derived from architecture-design.md

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion (`motion/react`) |
| Routing | React Router v7 |
| Wallet | wagmi/viem |
| Wallet Onboarding | Dynamic or Privy |
| Auth | SIWE (Sign-In with Ethereum) |
| Data | REST/GraphQL API |
| Real-time | Envio event subscriptions (websocket/polling) |

---

## Pages & Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing Page | ✅ Built |
| `/dashboard` | Dashboard | ✅ Built |
| `/borrow` | Borrow Flow | ❌ Not built |
| `/lend` | Lend Flow | ❌ Not built |
| `/sponsor` | Sponsor Flow | ❌ Not built |
| `/sponsor/graph` | Sponsor Graph (force-directed) | ❌ Not built |
| `/score/:wallet` | Score Detail (public) | ❌ Not built |

---

## Landing Page (`/`) — ✅ Built

### Sections
1. **Navbar** — compact on scroll, floating pill, links to `/dashboard`
2. **Hero** — headline, subhead, two CTAs, 5 floating product cards with entrance + float animations
3. **Stats** — protocol numbers (TVL, collateral range, detection speed, contracts)
4. **Integrations** — partner logos (Envio, Chainlink, Nansen, Monad, Dynamic, Privy)
5. **HowItWorks** — 4-step process (Scan → Borrow → Repay → Build)
6. **Markets** — 3 lending pools (General, Bluechip, Sponsored) with TVL/APY
7. **Trust** — trust metrics (contracts, detection, collateral, onchain)
8. **CTA** — dual CTAs for borrowers/lenders
9. **Newsletter** — email signup
10. **FAQ** — 6-item accordion
11. **Footer** — 5-column links

### Animations
- Loading screen with UNORA watermark reveal + progress bar
- All sections: scroll-triggered fade-in + stagger
- Hero cards: directional entry + floating idle
- Background: gradient mesh with radial blobs

---

## Dashboard (`/dashboard`) — ✅ Built

### Layout
- 3-column grid (4/5/3)
- Fixed navbar with nav links + wallet address
- Responsive

### Components

#### ScoreCard
- Credit score (large number)
- Score progress bar (0–100)
- Score breakdown (Repayment, History, Collateral, Liquidations)
- Soulbound NFT badge

#### LoanCeiling
- Maximum loan amount
- Collateral tier indicator with bar (20%–80%)
- Active positions (borrowed with repayment progress, deposited with APY)

#### ActivityFeed
- Recent activities list (stream ticks, repayments, score updates, deposits, loans, sponsorships)
- Search bar
- Live indicator
- Staggered entrance animations

#### SponsorRelationships
- "Sponsored by" section with sponsor cards
- "You sponsor" section with exposure tracking
- Invite button
- View sponsor graph link

#### QuickActions
- Request Loan (primary CTA)
- Deposit
- Sponsor Someone
- Pool stats (TVL, utilization)

#### DashboardNav
- Logo → home
- Nav links (Dashboard, Borrow, Lend, Sponsor)
- Testnet badge
- Wallet address button

---

## Borrow Flow (`/borrow`) — ❌ Not Built

### Screens
1. **Loan Request** — input amount, see live collateral requirement (driven by score)
2. **Collateral Lock** — confirm collateral amount, approve token, lock
3. **Loan Active** — repayment stream progress bar, stream status, score impact preview

### Data
- Fetch user's score + collateral tier from API
- Calculate collateral requirement in real-time
- Show loan terms (APR, duration, repayment schedule)
- Submit loan request to LendingPool contract

---

## Lend Flow (`/lend`) — ❌ Not Built

### Screens
1. **Pool Selection** — choose tranche (senior/junior), see APY + utilization
2. **Deposit** — input amount, approve token, deposit
3. **Position Manager** — current deposits, earned yield, withdrawal

### Data
- Fetch pool data (TVL, utilization, APY per tranche)
- Show projected yield calculator
- Reserve pool health indicator
- Withdrawal queue status

---

## Sponsor Flow (`/sponsor`) — ❌ Not Built

### Screens
1. **Browse Candidates** — list of wallets seeking sponsors, their scores, requested capacity
2. **Delegate Capacity** — input amount to delegate, see exposure risk
3. **Sponsored Wallets** — list of wallets you sponsor, real-time exposure, performance status
4. **My Sponsor** — who sponsors you, your delegated ceiling

### Data
- Fetch SponsorGraph relationships
- Calculate effective ceiling after delegation
- Show exposure if sponsored wallet defaults
- Slashing history

---

## Sponsor Graph View (`/sponsor/graph`) — ❌ Not Built

### Features
- Force-directed graph visualization
- Nodes = wallets, edges = sponsor relationships
- Color-coded by score tier
- Click node to see wallet details
- Real-time updates when relationships change

### Implementation
- D3.js or vis.js force-directed layout
- Interactive zoom/pan
- Tooltip on hover
- Filter by score range

---

## Score Detail (`/score/:wallet`) — ❌ Not Built

### Public Page
- Wallet's credit score
- Score history chart
- Loan repayment track record
- Sponsor relationships
- Soulbound NFT metadata

---

## Shared Components

### Layout
| Component | Description |
|-----------|-------------|
| `DashboardNav` | Fixed top nav with wallet address |
| `MobileNav` | Slide-out mobile menu |
| `Footer` | Site footer (landing) |

### UI Primitives
| Component | Description |
|-----------|-------------|
| `Card` | Reusable card container |
| `Button` | Primary/secondary/ghost variants |
| `Badge` | Status badges (Active, Streaming, Earning) |
| `ProgressBar` | Animated progress bar |
| `Input` | Form input with label |
| `Modal` | Dialog/modal overlay |
| `Toast` | Notification toast |

### Data Display
| Component | Description |
|-----------|-------------|
| `ScoreGauge` | Circular score display |
| `AddressBadge` | Truncated address with copy |
| `TokenAmount` | Formatted token amount |
| `APYDisplay` | APY with trend indicator |
| `StreamProgress` | Repayment stream progress |

---

## Wallet Integration

### wagmi/viem Setup
- Connect wallet button
- Network switching (Monad testnet)
- Balance display
- Transaction signing

### SIWE Auth
- Sign message on connect
- Verify signature against wallet
- Store session token
- Refresh on expiry

---

## API Integration

### Endpoints Needed
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/score/:wallet` | GET | Get wallet's credit score |
| `/api/score/:wallet/history` | GET | Score history |
| `/api/loans` | GET | List user's loans |
| `/api/loans` | POST | Create loan request |
| `/api/pools` | GET | List lending pools |
| `/api/pools/:id/deposit` | POST | Deposit into pool |
| `/api/sponsors` | GET | Get sponsor relationships |
| `/api/sponsors/delegate` | POST | Delegate capacity |
| `/api/activity/:wallet` | GET | Activity feed |
| `/api/health` | GET | Protocol health stats |

### Real-time Events (Envio)
| Event | Trigger |
|-------|---------|
| `StreamTick` | Repayment stream tick |
| `StreamStall` | Repayment missed |
| `ScoreUpdate` | Score changed |
| `LoanCreated` | New loan |
| `LoanRepaid` | Loan repaid |
| `DepositMade` | Pool deposit |
| `SponsorDelegated` | Capacity delegated |
| `DefaultFlagged` | Default detected |

---

## Smart Contract Interactions

### ScoreRegistry
- `getScore(wallet)` — read score
- `getCollateralTier(wallet)` — read tier
- `getLoanCeiling(wallet)` — read ceiling
- `getSponsor(wallet)` — read sponsor address

### LendingPool
- `borrow(amount, collateral)` — create loan
- `deposit(tranche, amount)` — deposit liquidity
- `withdraw(tranche, amount)` — withdraw
- `getPoolStats(tranche)` — read TVL/utilization

### StreamManager
- `createStream(loanId, rate)` — start repayment
- `pauseStream(streamId)` — pause
- `resumeStream(streamId)` — resume
- `getStreamStatus(streamId)` — read status

### SponsorGraph
- `delegate(sponsored, capacity)` — delegate capacity
- `revoke(sponsored)` — revoke sponsorship
- `getEffectiveCeiling(wallet)` — read effective ceiling
- `getExposure(sponsor)` — read total exposure

---

## UI/UX Guidelines

### Design System
- **Font Serif:** Newsreader (headings, scores)
- **Font Sans:** Plus Jakarta Sans (body, UI)
- **Font Mono:** JetBrains Mono (data, labels)
- **Accent:** Purple `#7C3AED`
- **Background:** Light lavender gradient with radial blobs
- **Cards:** White/70 glass morphism with backdrop blur

### Animations
- All page transitions: fade + slide
- Scroll-triggered: fade-in + stagger
- Cards: directional entry (left/right/bottom) + float idle
- Progress bars: animate from 0 on appear
- Loading screen: UNORA watermark reveal + progress bar

### Responsive Breakpoints
- Mobile: `< 640px` (stack columns)
- Tablet: `640–1024px` (2 columns)
- Desktop: `> 1024px` (full layout)

---

## Build Checklist

### Phase 1 — Landing ✅
- [x] Hero with floating cards
- [x] Stats section
- [x] Integrations
- [x] How it works
- [x] Markets
- [x] Trust
- [x] CTA
- [x] Newsletter
- [x] FAQ
- [x] Footer
- [x] Loading screen
- [x] Scroll animations
- [x] Route to dashboard

### Phase 2 — Dashboard ✅
- [x] Score card
- [x] Loan ceiling
- [x] Activity feed
- [x] Sponsor relationships
- [x] Quick actions
- [x] Dashboard nav

### Phase 3 — Core Flows
- [ ] Wallet connection (wagmi)
- [ ] SIWE auth
- [ ] Borrow flow (request → collateral lock → stream)
- [ ] Lend flow (pool select → deposit → position)
- [ ] Sponsor flow (browse → delegate → monitor)

### Phase 4 — Advanced
- [ ] Sponsor graph visualization (D3 force-directed)
- [ ] Score detail page (public)
- [ ] Real-time event subscriptions
- [ ] Mobile responsive polish
- [ ] Toast notifications
- [ ] Error boundaries
- [ ] Loading states (skeletons)
- [ ] Empty states

### Phase 5 — Polish
- [ ] Transaction pending states
- [ ] Success/error toasts
- [ ] Back navigation
- [ ] Deep linking
- [ ] SEO meta tags
- [ ] Open Graph images
- [ ] Analytics integration
