# Health Management Web App - Frontend

A professional, responsive, and interactive health management application built with React, TypeScript, and Tailwind CSS. This app allows users to manage family members' health data, upload and analyze medical reports using AI, and chat with an AI health assistant.

## 🌟 Features

- **User Authentication**: Secure JWT-based login and signup
- **Family Member Management**: Add and manage multiple family members
- **Medical Records**: Track medical history, medications, and reports
- **AI-Powered Report Analysis**: Upload medical reports (PDF/images) and get AI analysis via Gemini AI
- **AI Health Assistant**: Interactive chat interface for health-related questions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Healthcare Theme**: Clean UI with teal, blue, and white color scheme

## 🎨 Pages

1. **Login Page** - Secure authentication
2. **Signup Page** - New user registration
3. **Dashboard** - Overview of all family members with AI assistant
4. **Family Member Details** - Detailed view with tabs for reports, medical history, and medications

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Sonner** for toast notifications

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Update the API base URL in `/services/api.ts`:
   \`\`\`typescript
   const api = axios.create({
     baseURL: 'https://your-backend-url.com/api', // Update this
   });
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔌 Backend Integration

The frontend integrates with the following backend endpoints:

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Dashboard
- `GET /api/dashboard` - Get all family members

### Family Members
- `POST /api/family-members` - Add new family member
- `GET /api/family-members/:id` - Get member details
- `PUT /api/family-members/:id` - Update member
- `GET /api/family-members/:id/reports` - Get member reports
- `POST /api/family-members/:id/reports` - Upload report (multipart/form-data)

### AI
- `POST /api/ai/health-query` - Ask AI health questions

## 📂 Project Structure

\`\`\`
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── AddMemberDialog.tsx    # Modal to add family member
│   ├── AIHealthChat.tsx       # AI chat interface
│   ├── FamilyMemberCard.tsx   # Card component for members
│   ├── Navbar.tsx             # Navigation bar
│   ├── ProtectedRoute.tsx     # Route protection wrapper
│   └── ReportUploadSection.tsx # Upload reports component
├── pages/
│   ├── DashboardPage.tsx      # Main dashboard
│   ├── FamilyMemberDetailsPage.tsx # Member details
│   ├── LoginPage.tsx          # Login page
│   └── SignupPage.tsx         # Signup page
├── services/
│   ├── api.ts                 # API service layer
│   └── auth.ts                # Auth utilities
├── types/
│   └── index.ts               # TypeScript types
├── styles/
│   └── globals.css            # Global styles
└── App.tsx                    # Main app with routing
\`\`\`

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:
- Token is automatically added to all API requests
- Protected routes redirect to login if not authenticated
- Automatic logout on 401 responses

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablet and desktop
- Optimized layouts for all screen sizes
- Touch-friendly interactions

## 🎯 Key Features

### Dashboard
- Grid layout of family member cards
- Quick access to member details
- Integrated AI health assistant
- Easy member addition

### Family Member Details
- Tabbed interface for different data types
- Upload medical reports with drag & drop
- AI-powered report analysis
- View medical history and medications

### AI Health Assistant
- Real-time chat interface
- Health tips and symptom checking
- Persistent chat history during session
- Smooth animations

## 🚀 Deployment

1. Build the production version:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

3. Ensure your backend API is accessible and CORS is configured

## 📝 Environment Variables

Create a `.env` file for environment-specific configuration:

\`\`\`
VITE_API_BASE_URL=https://your-backend-url.com/api
\`\`\`

Then update `services/api.ts` to use:
\`\`\`typescript
baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
\`\`\`

## 🎨 Customization

### Colors
The app uses a healthcare theme with teal and blue gradients. To customize:
- Update gradient classes in components (e.g., `from-teal-500 to-blue-600`)
- Modify color tokens in `styles/globals.css`

### Typography
Typography is configured in `styles/globals.css` with default styles for headings, paragraphs, and other elements.

## 📄 License

This project is built for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
