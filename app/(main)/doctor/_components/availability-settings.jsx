"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { setAvailabilitySlots } from "@/actions/doctor"
import useFetch from "@/hooks/use-fetch"
import { toast } from "sonner"

export function AvailabilitySettings({ slots }) {
  const [showForm, setShowForm] = useState(false)

  const { loading, fn: submitSlots, data } =
    useFetch(setAvailabilitySlots)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: ""
    }
  })

  function createLocalDateFromTime(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const now = new Date()
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    )
  }

  const onSubmit = async (formValues) => {
    if (loading) return

    const formData = new FormData()

    const startDate = createLocalDateFromTime(formValues.startTime)
    const endDate = createLocalDateFromTime(formValues.endTime)

    if (startDate >= endDate) {
      toast.error("End time must be after start time")
      return
    }

    formData.append("startTime", startDate.toISOString())
    formData.append("endTime", endDate.toISOString())

    await submitSlots(formData)
  }

  useEffect(() => {
    if (data?.success) {
      setShowForm(false)
      toast.success("Availability updated successfully")
    }
  }, [data])

  const formatTimeString = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a")
    } catch {
      return "Invalid time"
    }
  }

  return (
    <Card className="bg-slate-900 border border-slate-800 shadow-xl">

      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Availability Settings
        </CardTitle>

        <CardDescription className="text-slate-400">
          Set your daily availability for patient appointments.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {!showForm ? (
          <>
            {/* CURRENT AVAILABILITY */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Current Availability
              </h3>

              {slots.length === 0 ? (
                <p className="text-slate-500">
                  You haven’t set availability yet. Add your schedule to start
                  receiving bookings.
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="
                        flex items-center 
                        p-4 
                        rounded-lg 
                        bg-slate-950 
                        border border-slate-800
                      "
                    >
                      <div className="bg-blue-600/10 p-3 rounded-xl mr-4">
                        <Clock className="h-4 w-4 text-blue-400" />
                      </div>

                      <div>
                        <p className="text-white font-medium">
                          {formatTimeString(slot.startTime)} –{" "}
                          {formatTimeString(slot.endTime)}
                        </p>

                        <p
                          className={`text-xs mt-1 ${
                            slot.appointment
                              ? "text-red-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {slot.appointment
                            ? "Booked"
                            : "Available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Availability Time
            </Button>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="
              space-y-6 
              border border-slate-800 
              rounded-xl 
              p-6 
              bg-slate-950
            "
          >
            <h3 className="text-lg font-semibold text-white">
              Set Daily Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label className="text-slate-400">
                  Start Time
                </Label>

                <Input
                  type="time"
                  {...register("startTime", {
                    required: "Start time is required"
                  })}
                  className="bg-slate-900 border border-slate-800 focus:border-blue-600"
                />

                {errors.startTime && (
                  <p className="text-sm text-red-400">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">
                  End Time
                </Label>

                <Input
                  type="time"
                  {...register("endTime", {
                    required: "End time is required"
                  })}
                  className="bg-slate-900 border border-slate-800 focus:border-blue-600"
                />

                {errors.endTime && (
                  <p className="text-sm text-red-400">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="border-slate-700 hover:bg-slate-800"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Availability"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* INFO BOX */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            How Availability Works
          </h4>

          <p className="text-slate-400 text-sm leading-relaxed">
          Setting your daily availability allows patients to book appointments
            during those hours. The same availability applies to all days. You
            can update your availability at any time, but existing booked
            appointments will not be affected.

          </p>
        </div>

      </CardContent>
    </Card>
  )
}