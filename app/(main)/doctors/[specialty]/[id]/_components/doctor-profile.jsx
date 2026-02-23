"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  User,
  Calendar,
  Clock,
  Medal,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SlotPicker } from "./slot-picker"
import { AppointmentForm } from "./appointment-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DoctorProfile({ doctor, availableDays }) {
  const [showBooking, setShowBooking] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const router = useRouter()

  const totalSlots = availableDays?.reduce(
    (total, day) => total + day.slots.length,
    0
  )

  const toggleBooking = () => {
    setShowBooking(!showBooking)
    if (!showBooking) {
      setTimeout(() => {
        document
          .getElementById("booking-section")
          ?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const handleBookingComplete = () => {
    router.push("/appointments")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* LEFT COLUMN */}
      <div className="md:col-span-1">
        <div className="md:sticky md:top-24">

          <Card className="bg-slate-900 border border-slate-800 shadow-xl">
            <CardContent className="pt-8">

              <div className="flex flex-col items-center text-center space-y-4">

                {/* AVATAR */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-blue-600/10 blur-2xl rounded-full"></div>

                  <div className="relative w-32 h-32 rounded-full overflow-hidden border border-slate-700">
                    {doctor.imageUrl ? (
                      <Image
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-600/10">
                        <User className="h-16 w-16 text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Dr. {doctor.name}
                  </h2>

                  <Badge
                    className="
                      mt-2 
                      bg-blue-600/10 
                      border border-blue-600/30 
                      text-blue-400
                    "
                  >
                    {doctor.specialty}
                  </Badge>
                </div>

                <div className="flex items-center text-slate-400">
                  <Medal className="h-4 w-4 mr-2 text-blue-400" />
                  {doctor.experience} years experience
                </div>

                <Button
                  onClick={toggleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  {showBooking ? (
                    <>
                      Hide Booking
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:col-span-2 space-y-8">

        {/* ABOUT SECTION */}
        <Card className="bg-slate-900 border border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              About Dr. {doctor.name}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Professional background and expertise
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <FileText className="h-5 w-5" />
                <h3 className="font-semibold text-white">
                  Description
                </h3>
              </div>

              <p className="text-slate-400 whitespace-pre-line leading-relaxed">
                {doctor.description}
              </p>
            </div>

            <Separator className="bg-slate-800" />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="h-5 w-5" />
                <h3 className="font-semibold text-white">
                  Availability
                </h3>
              </div>

              {totalSlots > 0 ? (
                <div className="flex items-center text-slate-400">
                  <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                  {totalSlots} time slots available in the next 4 days
                </div>
              ) : (
                <Alert className="bg-slate-950 border border-slate-800">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-slate-400">
                    No available slots in the next 4 days.
                  </AlertDescription>
                </Alert>
              )}
            </div>

          </CardContent>
        </Card>

        {/* BOOKING SECTION */}
        {showBooking && (
          <div id="booking-section">

            <Card className="bg-slate-900 border border-slate-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Book an Appointment
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Select a time slot and provide consultation details.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">

                {totalSlots > 0 ? (
                  <>
                    {!selectedSlot && (
                      <SlotPicker
                        days={availableDays}
                        onSelectSlot={setSelectedSlot}
                      />
                    )}

                    {selectedSlot && (
                      <AppointmentForm
                        doctorId={doctor.id}
                        slot={selectedSlot}
                        onBack={() => setSelectedSlot(null)}
                        onComplete={handleBookingComplete}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Available Slots
                    </h3>
                    <p className="text-slate-400">
                      This doctor currently has no available appointments.
                      Please check again later.
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>

          </div>
        )}

      </div>
    </div>
  )
}