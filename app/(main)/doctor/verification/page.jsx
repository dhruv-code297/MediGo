import {
  ClipboardCheck,
  AlertTriangle,
  XCircle
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCurrentUser } from "@/actions/onboarding"
import { redirect } from "next/navigation"

export default async function VerificationPage() {
  const user = await getCurrentUser()

  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor")
  }

  const isRejected = user?.verificationStatus === "REJECTED"

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">

        <Card className="bg-slate-900 border border-slate-800 shadow-2xl">

          {/* HEADER */}
          <CardHeader className="text-center space-y-6">

            <div className="relative mx-auto w-fit">
              <div className={`absolute inset-0 blur-2xl rounded-full ${
                isRejected ? "bg-red-500/10" : "bg-blue-600/10"
              }`} />

              <div className={`relative p-5 rounded-2xl ${
                isRejected ? "bg-red-500/10" : "bg-blue-600/10"
              }`}>
                {isRejected ? (
                  <XCircle className="h-10 w-10 text-red-400" />
                ) : (
                  <ClipboardCheck className="h-10 w-10 text-blue-400" />
                )}
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold">
                {isRejected
                  ? "Verification Declined"
                  : "Verification in Progress"}
              </CardTitle>

              <CardDescription className="text-slate-400 mt-2 text-lg">
                {isRejected
                  ? "Your application requires additional information."
                  : "Our team is reviewing your professional credentials."}
              </CardDescription>
            </div>
          </CardHeader>

          {/* CONTENT */}
          <CardContent className="text-center space-y-6">

            {isRejected ? (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex items-start gap-4 text-left">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-1" />
                <div className="text-slate-400 text-sm space-y-2">
                  <p>
                     Our administrative team has reviewed your application and
                    found that it doesn&apos;t meet our current requirements.
                    Common reasons for rejection include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Incomplete or unclear credentials</li>
                    <li>Insufficient professional experience</li>
                    <li>Missing service details</li>
                  </ul>
                  <p>
                    Please update your profile and resubmit for review.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 text-left">
                <AlertTriangle className="h-5 w-5 text-blue-400 mt-1" />
                <p className="text-slate-400 text-sm">
                 Your profile is currently under review by our administrative
                  team. This process typically takes 1-2 business days.
                  You&apos;ll receive an email notification once your account is
                  verified.
                </p>
              </div>
            )}

            <p className="text-slate-500 text-sm">
              {isRejected
                ? "Update your profile and resubmit to continue using Medigo as a verified doctor."
                : "While you wait, feel free to explore the platform or contact support for assistance."}
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

              <Button
                asChild
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
              >
                <Link href="/">Return Home</Link>
              </Button>

              {isRejected ? (
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/doctor/update-profile">
                    Update Profile
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/contact-support">
                    Contact Support
                  </Link>
                </Button>
              )}

            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
