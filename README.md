# EezySend Frontend

A modern, secure, and beautiful frontend for the EezySend document transfer platform built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🎨 Design Features

- **Single Viewport Hero + Login**: Clean, modern design combining hero section and authentication in one view
- **Glassmorphism UI**: Modern glass-effect design elements with backdrop blur
- **Responsive Layout**: Fully responsive design that works on all devices
- **Animated Elements**: Smooth transitions and subtle animations for better UX
- **Brand Colors**: Custom color scheme matching EezySend brand identity
  - Blue: `#1e3a8a` (Primary)
  - Green: `#16a34a` (Secondary)
  - Lime: `#84cc16` (Accent)

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
