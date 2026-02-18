import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { checkUser } from "@/lib/checkUser"
import { checkAndAllocateCredits } from "@/actions/credits"
import {
  Calendar,
  CreditCard,
  Shield,
  Stethoscope,
  User
} from "lucide-react"
import { Badge } from "./ui/badge"

const Header = async () => {
  const user = await checkUser()

  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user)
  }

  return (
    <header className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
      <nav className="container mx-auto px-6 h-[80px] flex items-center justify-between">

     <Link href="/">
  <Image 
    src='/logo.png' 
    alt='MediGo Logo' 
    width={400}
    height={120}
    className='h-[52px] md:h-[60px] w-auto object-contain max-w-none'
    priority
  />
</Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          <SignedIn>

            {/* ADMIN */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-slate-700 hover:bg-slate-800"
                >
                  <Shield className="h-4 w-4 text-blue-400" />
                  Admin
                </Button>
              </Link>
            )}

            {/* DOCTOR */}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-slate-700 hover:bg-slate-800"
                >
                  <Stethoscope className="h-4 w-4 text-blue-400" />
                  Dashboard
                </Button>
              </Link>
            )}

            {/* PATIENT */}
            {user?.role === "PATIENT" && (
              <Link href="/appointments">
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-slate-700 hover:bg-slate-800"
                >
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Appointments
                </Button>
              </Link>
            )}

            {/* UNASSIGNED */}
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-slate-700 hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-blue-400" />
                  Complete Profile
                </Button>
              </Link>
            )}
          </SignedIn>

          {/* CREDIT BADGE */}
          {(!user || user?.role !== "ADMIN") && (
            <Link href={user?.role === "PATIENT" ? "/pricing" : "/doctor"}>
              <Badge
                variant="outline"
                className="h-9 bg-blue-600/10 border-blue-600/30 px-3 py-1 flex items-center gap-2 hover:bg-blue-600/20 transition-all"
              >
                <CreditCard className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  {user && user.role !== "ADMIN" ? (
                    <>
                      {user.credits}
                      <span className="hidden md:inline ml-1">
                        {user?.role === "PATIENT"
                          ? "Credits"
                          : "Earned"}
                      </span>
                    </>
                  ) : (
                    "Pricing"
                  )}
                </span>
              </Badge>
            </Link>
          )}

          {/* AUTH */}
          <SignedOut>
            <SignInButton>
              <Button className="bg-blue-600 hover:bg-blue-700 transition-all">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-11 h-11",
                  userButtonPopoverCard:
                    "bg-slate-900 border border-slate-800 shadow-2xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>

        </div>
      </nav>
    </header>
  )
}

export default Header
