import { verifyAdmin } from "@/actions/admin";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CreditCard,
  Users,
  ShieldCheck
} from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Medigo",
  description:
    "Administrative control panel for managing doctors, verifications, and financial operations within Medigo.",
};

export default async function AdminLayout({ children }) {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <PageHeader
          icon={<ShieldCheck />}
          title="Admin Control Center"
          backLink="/"
          backLabel="Back to Platform"
        />

        {/* Proper spacing below title */}
        <div className="mt-20">

          <Tabs
            defaultValue="pending"
            className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-20"
          >

            {/* SIDEBAR */}
            <div>
              <TabsList
                className="
                  w-full
                  flex flex-col
                  gap-6
                  bg-transparent
                  border-none
                  p-0
                  rounded-2xl
                  shadow-none
                "
              >

                {/* Pending */}
                <TabsTrigger
                  value="pending"
                  className="
                    w-full
                    flex items-center gap-3
                    px-2 py-2
                    text-slate-400
                    justify-start
                    transition-all duration-200
                    bg-transparent
                    rounded-xl
                    shadow-none
                    hover:text-white
                    data-[state=active]:text-blue-400
                    data-[state=active]:border-l-2
                    data-[state=active]:border-blue-500
                  "
                >
                  <AlertCircle className="h-4 w-4" />
                  Pending Verification
                </TabsTrigger>

                {/* Doctors */}
                <TabsTrigger
                  value="doctors"
                  className="
                    w-full
                    flex items-center gap-3
                    px-2 py-2
                    text-slate-400
                    justify-start
                    transition-all duration-200
                    bg-transparent
                    rounded-xl
                    shadow-none
                    hover:text-white
                    data-[state=active]:text-blue-400
                    data-[state=active]:border-l-2
                    data-[state=active]:border-blue-500
                  "
                >
                  <Users className="h-4 w-4" />
                  Doctors
                </TabsTrigger>

                {/* Payouts */}
                <TabsTrigger
                  value="payouts"
                  className="
                    w-full
                    flex items-center gap-3
                    px-2 py-2
                    text-slate-400
                    justify-start
                    transition-all duration-200
                    bg-transparent
                    rounded-xl
                    shadow-none
                    hover:text-white
                    data-[state=active]:text-blue-400
                    data-[state=active]:border-l-2
                    data-[state=active]:border-blue-500
                  "
                >
                  <CreditCard className="h-4 w-4" />
                  Payouts
                </TabsTrigger>

              </TabsList>
            </div>

            {/* MAIN PANEL */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 shadow-2xl">
              {children}
            </div>

          </Tabs>

        </div>
      </div>
    </div>
  );
}