# HC UI - Frontend & Backend

This project is split into two separate applications:

- **Frontend**: Next.js application (root directory)
- **Backend**: Express.js API server (`backend/` directory)

## Project Structure

```
hc-ui/
├── backend/          # Express.js backend server
│   ├── lib/         # Database models and utilities
│   ├── routes/      # API routes
│   ├── index.ts     # Server entry point
│   └── package.json # Backend dependencies
├── app/             # Next.js app directory
├── components/      # React components
├── public/          # Static files
└── package.json     # Frontend dependencies
```

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# Backend Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your-secret-key-here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Running the Applications

### Development Mode

**Run Frontend:**
```bash
npm run dev
```

**Run Backend:**
```bash
cd backend
npm run dev
```

Or run both in separate terminals.

### Production Mode

**Build and run Frontend:**
```bash
npm run build
npm start
```

**Build and run Backend:**
```bash
cd backend
npm run build
npm start
```

## API Endpoints

The backend server runs on `http://localhost:5000` and provides:

- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

Similar endpoints for: blogs, faqs, testimonials, stats, about-us, offers, instagram, skincare, settings, upload, auth

## Frontend Configuration

The frontend is configured to proxy API calls to the backend. Update `next.config.js` if you need to change the backend URL.

## Deployment

### Frontend
Deploy to Vercel, Netlify, or any Next.js hosting platform.

### Backend
Deploy to Railway, Render, Heroku, or any Node.js hosting platform.

Make sure to set environment variables in your deployment platform.






