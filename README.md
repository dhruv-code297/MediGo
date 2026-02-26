# 🏥 MediGo – AI-Powered Healthcare Platform

MediGo is a full-stack healthcare platform built with **Next.js 14** that connects **Patients, Doctors, and Admins** in a secure and scalable environment.

It supports real-time video consultations, credit-based appointment booking, doctor verification workflows, and payout management.

---

## 🚀 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS v4
- ShadCN UI
- Framer Motion
- React Hook Form + Zod

### Backend
- Next.js Server Actions
- Prisma ORM
- Neon PostgreSQL Database

### Authentication & Payments
- Clerk (Authentication + Role Management)
- Clerk Payments (Credit Purchase System)

### Real-Time Communication
- Vonage Video API (Doctor-Patient Video Calls)
- Vonage Messages API

---

## 👥 User Roles

### 1️⃣ Patient
- Sign up / Login via Clerk
- Onboard as Patient
- Buy credits via Clerk Payments
- Browse doctors by specialty
- Book appointments using credits
- Join secure video consultation
- View appointment history

### 2️⃣ Doctor
- Onboard as Doctor
- Submit verification request
- Wait for admin approval
- Set availability (next 4 days with time slots)
- Accept appointments
- Conduct video consultations
- Request payouts for earned credits

### 3️⃣ Admin
- Verify / Reject doctors
- Manage users
- Monitor appointments
- Handle payout requests
- Platform-level controls

---

## 💳 Credit System

- Patients purchase platform credits.
- Credits are used to book doctor appointments.
- Doctors earn credits from completed consultations.
- Doctors can request payouts from admin.
- Admin processes payout requests manually.

---

## 📅 Appointment Flow

1. Patient selects doctor.
2. Patient chooses available time slot (next 4 days).
3. Credits are deducted.
4. Appointment is created.
5. At scheduled time → Video session starts via Vonage.
6. Doctor earns credits after session.

---

## 🛠️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/medigo.git
cd medigo
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# Vonage
VONAGE_API_KEY=
VONAGE_API_SECRET=
```

### 4️⃣ Setup Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5️⃣ Run Development Server

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```

---

## 🗄️ Database

- PostgreSQL (Neon)
- Managed using Prisma ORM
- Includes models for:
  - Users
  - Doctors
  - Patients
  - Appointments
  - Credits
  - Payout Requests

---

## 🔐 Authentication & Authorization

- Clerk handles authentication.
- Role-based access:
  - Admin
  - Doctor
  - Patient
- Middleware protects role-specific routes.

---

## 🎥 Video Consultation

Powered by **Vonage Video API**:
- Secure room generation
- Token-based session access
- Real-time doctor-patient interaction

---

## 📦 Project Structure

```
/app
  /admin
  /doctor
  /patient
  /api
/components
/actions
/lib
/prisma
```

---

## ✨ Features

- Role-based onboarding
- Doctor verification workflow
- Credit-based economy
- Real-time video calls
- Availability scheduling
- Admin dashboard
- Payout management
- Responsive UI
- Dark mode support

---

## 📈 Future Improvements

- Automated payouts (Stripe Connect)
- Ratings & Reviews system
- Medical history uploads
- AI symptom checker
- Email/SMS notifications
- Appointment reminders

---

## 🧠 Why MediGo?

MediGo is designed to:
- Simplify remote healthcare
- Enable doctors to monetize consultations
- Provide secure telemedicine infrastructure
- Offer scalable SaaS architecture

---

## 👨‍💻 Author

Dhruv   
Full Stack Developer  

---

