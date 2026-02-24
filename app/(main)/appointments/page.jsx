import { getPatientAppointments } from "@/actions/patient";
import { AppointmentCard } from "@/components/appointment-card";
import { PageHeader } from "@/components/page-header";
import { Calendar, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/onboarding";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { appointments, error } = await getPatientAppointments();

  return (
    <div className="container mx-auto px-4 py-10">
      
      {/* Header */}
      <PageHeader
        icon={<Calendar />}
        title="My Appointments"
        backLink="/doctors"
        backLabel="Find Doctors"
      />

      {/* Main Card */}
      <Card className="relative border-blue-900/30 bg-gradient-to-b from-background to-blue-950/10 backdrop-blur-md shadow-xl overflow-hidden">
        
        {/* Subtle glow effect */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>

        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Your Scheduled Appointments
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          
          {/* Error State */}
          {error ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-4">
                <Calendar className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">Error: {error}</p>
            </div>
          ) : appointments?.length > 0 ? (
            
            /* Appointments List */
            <div className="space-y-5">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="transition-all duration-300 hover:scale-[1.01]"
                >
                  <AppointmentCard
                    appointment={appointment}
                    userRole="PATIENT"
                  />
                </div>
              ))}
            </div>

          ) : (
            
            /* Empty State */
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 rounded-full bg-blue-900/20 flex items-center justify-center mb-6">
                <Calendar className="h-10 w-10 text-blue-400" />
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                No appointments yet
              </h3>

              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                You haven't booked any consultations yet. Discover verified doctors
                and schedule your first appointment in seconds.
              </p>

              <Link href="/doctors">
                <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                  Browse Doctors
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}