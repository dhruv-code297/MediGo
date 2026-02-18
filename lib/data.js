import {
  CalendarClock,
  Video,
  CreditCard,
  UserCircle2,
  FileCheck2,
  Shield,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

/* ============================= */
/* FEATURES – How Medigo Works  */
/* ============================= */

export const features = [
  {
    icon: <UserCircle2 className="h-6 w-6 text-blue-400" />,
    title: "Digital Health Identity",
    description:
      "Create your secure health profile and unlock personalized, AI-driven care recommendations.",
  },
  {
    icon: <CalendarClock className="h-6 w-6 text-blue-400" />,
    title: "Real-Time Scheduling",
    description:
      "View live doctor availability and confirm appointments instantly — no waiting, no back-and-forth.",
  },
  {
    icon: <Video className="h-6 w-6 text-blue-400" />,
    title: "Encrypted Video Care",
    description:
      "Consult specialists through high-definition, end-to-end encrypted video sessions.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-blue-400" />,
    title: "Smart Credit System",
    description:
      "Flexible healthcare payments powered by transparent credit-based subscriptions.",
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-400" />,
    title: "Verified Medical Network",
    description:
      "All doctors are identity-verified and credential-validated to ensure trusted care.",
  },
  {
    icon: <FileCheck2 className="h-6 w-6 text-blue-400" />,
    title: "Unified Medical Records",
    description:
      "Access prescriptions, consultation history, and recommendations from a single secure dashboard.",
  },
];

/* ============================= */
/* TESTIMONIALS                 */
/* ============================= */

export const testimonials = [
  {
    initials: "SP",
    name: "Sarah Parker",
    role: "Product Manager",
    quote:
      "Medigo feels like the future of healthcare. The interface is clean, the booking is instant, and the consultations are incredibly smooth.",
  },
  {
    initials: "RM",
    name: "Dr. Robert Miller",
    role: "Cardiologist",
    quote:
      "The platform enables me to deliver high-quality digital care without compromising privacy or efficiency.",
  },
  {
    initials: "JT",
    name: "James Thompson",
    role: "Entrepreneur",
    quote:
      "The subscription credit model is simple and transparent. It removes the friction from accessing specialists.",
  },
];

/* ============================= */
/* CREDIT SYSTEM BENEFITS       */
/* ============================= */

export const creditBenefits = [
  "Each consultation requires <strong class='text-blue-400'>2 credits</strong>, regardless of session duration.",
  "Credits <strong class='text-blue-400'>never expire</strong> — use them whenever care is needed.",
  "Subscriptions automatically allocate <strong class='text-blue-400'>fresh monthly credits</strong>.",
  "Modify or cancel your plan <strong class='text-blue-400'>anytime</strong> without penalties.",
];
