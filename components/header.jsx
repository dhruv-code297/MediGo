import React from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";
import { checkAndAllocateCredits } from "@/actions/credits";
import Image from "next/image";

export default async function Header() {
  const user = await checkUser();
  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }

  return (
    <header className="fixed top-0 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl z-50">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">

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

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">

          <SignedIn>

            {/* Admin */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-slate-700 hover:bg-slate-800 hover:border-blue-500/40 transition-all"
                >
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  Admin Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 hover:bg-slate-800">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                </Button>
              </Link>
            )}

            {/* Doctor */}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-slate-700 hover:bg-slate-800 hover:border-blue-500/40 transition-all"
                >
                  <Stethoscope className="h-4 w-4 text-blue-400" />
                  Doctor Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 hover:bg-slate-800">
                  <Stethoscope className="h-4 w-4 text-blue-400" />
                </Button>
              </Link>
            )}

            {/* Patient */}
            {user?.role === "PATIENT" && (
              <Link href="/appointments">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-slate-700 hover:bg-slate-800 hover:border-blue-500/40 transition-all"
                >
                  <Calendar className="h-4 w-4 text-blue-400" />
                  My Appointments
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 hover:bg-slate-800">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </Button>
              </Link>
            )}

            {/* Unassigned */}
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-slate-700 hover:bg-slate-800 hover:border-blue-500/40 transition-all"
                >
                  <User className="h-4 w-4 text-blue-400" />
                  Complete Profile
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 hover:bg-slate-800">
                  <User className="h-4 w-4 text-blue-400" />
                </Button>
              </Link>
            )}
          </SignedIn>

          {/* Credits / Pricing */}
          {(!user || user?.role !== "ADMIN") && (
            <Link href={user?.role === "PATIENT" ? "/pricing" : "/doctor"}>
              <Badge
                variant="outline"
                className="h-9 bg-blue-600/10 border-blue-500/30 px-4 py-1 flex items-center gap-2 hover:bg-blue-600/20 transition-all cursor-pointer"
              >
                <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-blue-400 font-medium">
                  {user && user.role !== "ADMIN" ? (
                    <>
                      {user.credits}{" "}
                      <span className="hidden md:inline">
                        {user?.role === "PATIENT"
                          ? "Credits"
                          : "Earned Credits"}
                      </span>
                    </>
                  ) : (
                    <>Pricing</>
                  )}
                </span>
              </Badge>
            </Link>
          )}

          {/* Signed Out */}
          <SignedOut>
            <SignInButton>
              <Button className="bg-blue-600 hover:bg-blue-700 transition-all">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          {/* Signed In */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-blue-500/40",
                  userButtonPopoverCard: "shadow-2xl bg-slate-900 border border-slate-800",
                  userPreviewMainIdentifier: "font-semibold text-white",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

        </div>
      </nav>
    </header>
  );
}

