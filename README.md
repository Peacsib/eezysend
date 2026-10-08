# EezySend - Financial Remittance Operations Dashboard

A premium, secure financial remittance management system for CABS (Central African Building Society) and other financial institutions. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## 💼 What is EezySend?

**EezySend** is a **Local Remittance Operations Portal** that enables financial institutions to:

- **Process domestic money transfers** between customers and branches
- **Monitor transaction status** (pending, collected, failed)
- **Track SMS notifications** sent to beneficiaries
- **Monitor system health** of the remittance infrastructure
- **Generate settlement reports** for audit and compliance
- **Manage counter collections** at physical branches

### Use Case Example
When Tendai in Harare sends $350 to Chipo in Bulawayo:
1. Teller creates the remittance voucher in the system
2. EezySend generates a unique reference (e.g., `EZS-20261005-0981`)
3. System sends SMS notification to beneficiary with pickup details
4. Beneficiary collects cash at designated CABS branch
5. System tracks collection, fees (IMTT taxes), and settlement

---

## 📊 Dashboard Tabs Explained

### 1. 📈 **Reports & Settlements** (Default Tab)

**Purpose**: Financial overview, audit trail, and end-of-day settlement processing

**What You See**:
- **Total Remittance Volume**: Sum of all money transfers (USD currency settled)
- **Total Transactions**: Count of vouchers with success rate (collected vs total)
- **Fees & Taxes Collected**: Service charges and IMTT (Intermediated Money Transfer Tax)
- **Transaction Table**: Complete list of all remittances with:
  - Voucher reference number
  - Sender name and branch
  - Beneficiary name and city
  - Amount and currency
  - Status (Collected, Pending, Failed)
  - Quick view button for details

**Key Actions**:
- 🔄 **Run Settlement**: Triggers end-of-day reconciliation process
- 📥 **Export CSV**: Download transaction data for accounting/audit
- 🔍 **Search & Filter**: Find specific transactions by reference, name, or phone
- 📅 **Date Filter**: View transactions within a specific date range

**Who Uses It**: Branch managers, finance officers, auditors

---

### 2. 💸 **Transactions** 

**Purpose**: Real-time transaction management and voucher operations

**What You See**:
- **Total Remittance Volume**: Live tally of money in transit
- **Ready for Collection**: Amount held in escrow waiting for beneficiary pickup
- **Disbursed & Settled**: Successfully completed transactions
- **Transaction Lookup**: Search by voucher reference or phone number
- **Voucher Status Tracking**: Monitor individual transaction progress
- **T24 Integration Status**: Connection to core banking system

**Key Actions**:
- 🔍 **Direct Search**: Instant lookup by voucher reference or phone
- 📄 **View Transaction Details**: Complete remittance information modal
- ↩️ **Transaction Reversals**: Cancel/reverse failed transactions (if authorized)
- 🔔 **Resend SMS**: Re-notify beneficiary if message wasn't received

**Who Uses It**: Tellers, customer service officers, operations team

---

### 3. 📱 **SMS Center**

**Purpose**: Communication gateway monitoring and SMS delivery tracking

**What You See**:
- **Total SMS Dispatched**: Count of all messages sent to beneficiaries
- **Delivered Successfully**: Messages confirmed delivered by SMS gateway
- **Delivery Exceptions**: Failed/queued messages requiring attention
- **SMS Log Table**: Complete audit trail with:
  - Recipient phone number
  - Message type (Voucher Ready, Collection Confirmed, etc.)
  - Delivery timestamp
  - Gateway status (Delivered, Pending, Failed)
  - Cost per message

**Key Actions**:
- 🔍 **Search by Phone**: Find all messages sent to specific number
- 🔄 **Retry Failed Messages**: Resend messages that didn't deliver
- 📊 **Gateway Health**: Monitor SMS provider connectivity
- 💰 **Cost Tracking**: View SMS charges for billing

**Who Uses It**: Operations officers, IT support, customer care

---

### 4. 🏥 **System Health**

**Purpose**: Real-time infrastructure monitoring and API health checks

**What You See**:
- **Core Remit Service**: Main application status (UP/DOWN)
- **API Response Latency**: System performance in milliseconds
- **Service Availability**: Uptime percentage and SLA compliance
- **Subsystems Table**: Status of all integrated services:
  - **NLB (Network Load Balancer)**: Traffic distribution
  - **T24 Core Banking**: Account verification and settlement
  - **SMS Gateway**: Message delivery infrastructure
  - **Remit API**: Main remittance processing service
  - **Database & Storage**: PostgreSQL/MySQL connectivity

**Key Actions**:
- 🔄 **Ping System Now**: Live health check of all services
- 🔍 **Search Subsystems**: Filter by service name or category
- 📋 **View /health Endpoint**: See raw JSON health check response
- 📊 **Infrastructure/Integrations Filter**: Group services by type

**Who Uses It**: DevOps engineers, system administrators, IT support

---

## 🎨 Design Features

- **Premium Glassy UI**: Transparent cards with backdrop blur for modern aesthetic
- **Blue Sidebar Design**: `#0A3E94` brand color with white active states
- **White Logo**: High-resolution vector logo optimized for dark backgrounds
- **Micro-interactions**: Smooth transitions, hover effects, scale animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Tailwind v4**: Modern CSS with theme-based color system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd eezysend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Update the `.env.local` file with your API configuration if needed.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
eezysend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with hero + login
│   └── globals.css         # Global styles and Tailwind config
├── components/
│   └── LoginForm.tsx       # Authentication form component
├── lib/
│   └── api.ts              # API client and service functions
├── public/
│   ├── hero.png            # Hero background image
│   └── eezysend.png        # EezySend logo
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔌 API Integration

The application is configured to connect to the EezySend backend API:

**Base URL**: `http://eezysend-nlb-871901cdb8bcb72b.elb.eu-west-1.amazonaws.com/eezysend`

### API Services

Located in `lib/api.ts`:

- **authApi**: Authentication endpoints (login, register, logout)
- **documentsApi**: Document management endpoints (list, upload, download)

Update the API endpoints in `lib/api.ts` based on the actual Swagger documentation once accessible.

## 🎯 Features

### Current Features

- ✅ Modern single-viewport hero + login design
- ✅ Tab-based authentication (Sign In / Sign Up)
- ✅ Form validation and loading states
- ✅ Responsive design for all screen sizes
- ✅ Glassmorphism UI effects
- ✅ Brand-consistent color scheme
- ✅ SSO options (Google, GitHub placeholders)
- ✅ API client structure ready for integration

### Planned Features

- [ ] Dashboard after login
- [ ] Document upload interface
- [ ] Document listing and management
- [ ] User profile management
- [ ] Institution selection and verification
- [ ] Real-time document transfer status
- [ ] Notification system
- [ ] Multi-language support

## 🛠️ Technologies

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Optimization**: Next.js Image component

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  'eezysend-blue': '#1e3a8a',
  'eezysend-green': '#16a34a',
  'eezysend-lime': '#84cc16',
}
```

### Branding

Replace images in the `public/` folder:
- `hero.png` - Background hero image
- `eezysend.png` - Logo image

## 📝 License

This project is proprietary and confidential.

## 👥 Team

Built with creativity and attention to detail, inspired by successful projects like LogmatE UI, UZConnect, and Clear Path.

---

**Note**: Update the API endpoints in `lib/api.ts` once you have access to the complete Swagger documentation.
