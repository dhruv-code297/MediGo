import { ClipboardCheck, AlertCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-950">
      <div className="w-full max-w-2xl relative">

        {/* Subtle Glow Background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>

        <Card className="relative bg-slate-900 border border-slate-800 shadow-2xl">
          <CardHeader className="text-center space-y-4">

            <div
              className={`mx-auto p-5 rounded-2xl w-fit ${
                isRejected
                  ? "bg-red-600/10"
                  : "bg-blue-600/10"
              }`}
            >
              {isRejected ? (
                <XCircle className="h-8 w-8 text-red-400" />
              ) : (
                <ClipboardCheck className="h-8 w-8 text-blue-400" />
              )}
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              {isRejected
                ? "Verification Declined"
                : "Verification in Progress"}
            </CardTitle>

            <CardDescription className="text-slate-400 text-lg">
              {isRejected
                ? "Your application requires revision before approval"
                : "Thank you for submitting your professional details"}
            </CardDescription>

          </CardHeader>

          <CardContent className="text-center space-y-6">

            {isRejected ? (
              <div className="bg-red-600/5 border border-red-500/20 rounded-xl p-5 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                <div className="text-slate-400 text-left text-sm leading-relaxed">
                  <p className="mb-2">
                    Our administrative team reviewed your submission and found
                    some areas that need clarification or improvement.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Credential documentation unclear or incomplete</li>
                    <li>Professional experience requirements not met</li>
                    <li>Insufficient service description details</li>
                  </ul>
                  <p>
                    You can revise your profile and resubmit it for approval.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-5 flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <p className="text-slate-400 text-left text-sm leading-relaxed">
                  Your profile is currently under review by our verification
                  team. This process typically takes 1–2 business days.
                  You’ll receive an email notification once your account is
                  approved.
                </p>
              </div>
            )}

            <p className="text-slate-400">
              {isRejected
                ? "Update your profile and resubmit for verification."
                : "Feel free to explore the platform while your profile is being reviewed."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              {isRejected ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    <Link href="/">Return to Home</Link>
                  </Button>

                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    <Link href="/doctor/update-profile">
                      Update Profile
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    <Link href="/">Return to Home</Link>
                  </Button>

                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    <Link href="/contact-support">
                      Contact Support
                    </Link>
                  </Button>
                </>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}