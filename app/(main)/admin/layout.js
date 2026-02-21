import { verifyAdmin } from "@/actions/admin"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CreditCard,
  Users,
  ShieldCheck
} from "lucide-react"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Admin Dashboard | Medigo",
  description:
    "Administrative control panel for managing doctors, verifications, and financial operations within Medigo.",
}

export default async function AdminLayout({ children }) {
  const isAdmin = await verifyAdmin()

  if (!isAdmin) {
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <PageHeader
          icon={<ShieldCheck />}
          title="Admin Control Center"
          backLink="/"
          backLabel="Back to Platform"
        />

        {/* CONTENT GRID */}
        <Tabs
          defaultValue="pending"
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >

          {/* SIDEBAR */}
          <TabsList
            className="
              md:col-span-1 
              bg-slate-900 
              border border-slate-800 
              rounded-xl 
              p-3 
              flex md:flex-col gap-2
            "
          >
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 px-4 py-3 justify-start data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <AlertCircle className="h-4 w-4" />
              Pending Verification
            </TabsTrigger>

            <TabsTrigger
              value="doctors"
              className="flex items-center gap-2 px-4 py-3 justify-start data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4" />
              Doctors
            </TabsTrigger>

            <TabsTrigger
              value="payouts"
              className="flex items-center gap-2 px-4 py-3 justify-start data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4" />
              Payouts
            </TabsTrigger>
          </TabsList>

          {/* MAIN PANEL */}
          <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
            {children}
          </div>

        </Tabs>
      </div>
    </div>
  )
}