# Gigly - Freelance Platform Backend

A comprehensive backend API for a freelance marketplace platform built with Node.js, Express.js, MongoDB, and Socket.io. This backend supports user authentication, gig management, order processing, real-time chat, payment integration with Stripe, and email services.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with email verification
- **Role-Based Access Control** - Separate functionality for clients and freelancers
- **Gig Management** - Create, read, update, delete gigs with image upload
- **Order Management** - Complete order lifecycle from creation to delivery
- **Real-time Chat** - Socket.io powered messaging system
- **Payment Integration** - Stripe checkout and payment processing
- **Email Services** - OTP verification and welcome emails
- **File Upload** - Cloudinary integration for image storage
- **Rating & Review System** - Feedback system for completed orders

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io
- **Payment Processing**: Stripe
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv

## 📁 Project Structure

```
Backend/
├── controllers/          # Business logic controllers
│   ├── authController.js      # Authentication logic
│   ├── gigsController.js      # Gig management
│   ├── orderController.js     # Order processing
│   ├── chatController.js      # Chat functionality
│   ├── CheckoutController.js  # Payment processing
│   ├── freelancerController.js # Freelancer profiles
│   └── mailController.js      # Email services
├── models/               # MongoDB schemas
│   ├── User.js               # User model
│   ├── Gigs.js               # Gig model
│   ├── Order.js              # Order model
│   ├── Freelancer.js         # Freelancer profile model
│   ├── Message.js            # Chat message model
│   └── Conversation.js       # Chat conversation model
├── routes/               # API route definitions
│   ├── authRoutes.js         # Authentication routes
│   ├── gigsRoutes.js         # Gig management routes
│   ├── orderRoutes.js        # Order management routes
│   ├── messageRoutes.js      # Chat routes
│   ├── checkoutRoutes.js     # Payment routes
│   ├── freelanceFetchRoute.js # Freelancer routes
│   └── mail.js               # Email routes
├── middleware/           # Custom middleware
│   ├── authMiddleware.js     # JWT authentication
│   └── uploadCloudinary.js   # File upload handling
├── config/               # Configuration files
├── utils/                # Utility functions
└── index.js              # Main server file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account (for image uploads)
- Stripe account (for payments)
- Email service credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/gigly
   # or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/gigly

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   CLIENT_URL=http://localhost:5173

   # Email Configuration (Gmail example)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

**Base Route**: `/api/auth`

| Method | Endpoint        | Description                 | Auth Required |
| ------ | --------------- | --------------------------- | ------------- |
| POST   | `/register`     | Register new user           | No            |
| POST   | `/login`        | User login                  | No            |
| POST   | `/verify-email` | Verify email with OTP       | No            |
| POST   | `/resend-otp`   | Resend OTP for verification | No            |

**Register User**

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "client" // or "freelancer"
}
```

**Login User**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Gig Management Endpoints

**Base Route**: `/api/gigs`

| Method | Endpoint   | Description                 | Auth Required |
| ------ | ---------- | --------------------------- | ------------- |
| POST   | `/create`  | Create new gig              | Yes           |
| GET    | `/`        | Get all gigs                | No            |
| GET    | `/my-gigs` | Get user's gigs             | Yes           |
| GET    | `/others`  | Get other freelancers' gigs | Yes           |
| GET    | `/:id`     | Get single gig              | No            |
| PUT    | `/:id`     | Update gig                  | Yes           |
| DELETE | `/:id`     | Delete gig                  | Yes           |

**Create Gig**

```http
POST /api/gigs/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "I will create a modern website",
  "description": "Professional website development...",
  "category": "Web Development",
  "price": 500,
  "thumbnail": <file>
}
```

### Order Management Endpoints

**Base Route**: `/api/orders`

| Method | Endpoint              | Description              | Auth Required |
| ------ | --------------------- | ------------------------ | ------------- |
| POST   | `/create-order`       | Create new order         | Yes           |
| GET    | `/my-orders`          | Get user's orders        | Yes           |
| GET    | `/freelancer-order`   | Get freelancer's orders  | Yes           |
| PATCH  | `/:id/progress`       | Update order progress    | Yes           |
| PATCH  | `/:id/complete`       | Mark order as delivered  | Yes           |
| PATCH  | `/:id/accept`         | Accept order             | Yes           |
| PATCH  | `/:id/rate`           | Rate completed order     | Yes           |
| GET    | `/:id/single-order`   | Get single order details | Yes           |
| GET    | `/gig/:gigId/reviews` | Get gig reviews          | Yes           |

### Chat/Messaging Endpoints

**Base Route**: `/api/chat`

| Method | Endpoint                    | Description               | Auth Required |
| ------ | --------------------------- | ------------------------- | ------------- |
| GET    | `/messages/:conversationId` | Get conversation messages | Yes           |
| POST   | `/conversation`             | Create/get conversation   | Yes           |
| GET    | `/conversations`            | Get user conversations    | Yes           |
| POST   | `/message`                  | Send message              | Yes           |
| POST   | `/conversations/add-client` | Add client to chat list   | No            |
| GET    | `/conversations/clients`    | Get all clients           | No            |

### Payment Endpoints

**Base Route**: `/api/checkout`

| Method | Endpoint                   | Description                    | Auth Required |
| ------ | -------------------------- | ------------------------------ | ------------- |
| POST   | `/create-checkout-session` | Create Stripe checkout session | No            |

**Create Checkout Session**

```http
POST /api/checkout/create-checkout-session
Content-Type: application/json

{
  "gigId": "gig_id_here",
  "userId": "user_id_here",
  "price": 500,
  "gigImg": "image_url_here"
}
```

### Freelancer Profile Endpoints

**Base Route**: `/api/freelancers`

| Method | Endpoint  | Description               | Auth Required |
| ------ | --------- | ------------------------- | ------------- |
| POST   | `/create` | Create freelancer profile | Yes           |
| GET    | `/`       | Get freelancer profiles   | Yes           |

### Email Service Endpoints

**Base Route**: `/api/mail`

| Method | Endpoint | Description        | Auth Required |
| ------ | -------- | ------------------ | ------------- |
| POST   | `/email` | Send welcome email | No            |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Models

### User Model

```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['client', 'freelancer']),
  isVerified: Boolean (default: false),
  otp: String,
  otpExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Gig Model

```javascript
{
  userId: ObjectId (ref: 'User'),
  freelancerId: ObjectId (ref: 'Freelancer'),
  title: String (required),
  description: String (required),
  category: String (required),
  price: Number (required),
  thumbnail: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```javascript
{
  userId: ObjectId (ref: 'User'),
  gigId: ObjectId (ref: 'Gig'),
  freelancerId: ObjectId (ref: 'Freelancer'),
  price: Number (required),
  status: String (enum: ['processing', 'in-progress', 'submitted', 'delivered']),
  stripeSessionId: String (required),
  gigTitle: String (required),
  freelancerName: String (required),
  deliveryFileUrl: String,
  deliveryMessage: String,
  clientRating: Number (0-5),
  clientFeedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 Socket.io Events

The application uses Socket.io for real-time communication:

### Client Events

- `join-chat` - Join a chat room
- `send-msg` - Send a message
- `disconnect` - User disconnects

### Server Events

- `msg-receive` - Receive a message
- `user-online` - User comes online
- `user-offline` - User goes offline

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gigly
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_live_key
CLIENT_URL=https://your-frontend-domain.com
EMAIL_USER=your_production_email@domain.com
EMAIL_PASSWORD=your_production_email_password
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@gigly.com or join our Slack channel.

---

**Built with ❤️ by the Gigly Team**
