"use client"

import { useEffect } from "react"
import { getDoctorAppointments } from "@/actions/doctor"
import { AppointmentCard } from "@/components/appointment-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Calendar } from "lucide-react"
import useFetch from "@/hooks/use-fetch"

export default function DoctorAppointmentsList() {
  const {
    loading,
    data,
    fn: fetchAppointments
  } = useFetch(getDoctorAppointments)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const appointments = data?.appointments || []

  return (
    <Card className="bg-slate-900 border border-slate-800 shadow-xl">

      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          Upcoming Appointments
        </CardTitle>

        <CardDescription className="text-slate-400">
          Review and manage your scheduled consultations.
        </CardDescription>
      </CardHeader>

      <CardContent>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={fetchAppointments}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-14 w-14 mx-auto text-slate-600 mb-4" />

            <h3 className="text-xl font-semibold text-white mb-2">
              No Upcoming Appointments
            </h3>

            <p className="text-slate-400 max-w-md mx-auto">
              You currently don’t have any scheduled consultations.
              Set your availability so patients can book appointments.
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  )
}