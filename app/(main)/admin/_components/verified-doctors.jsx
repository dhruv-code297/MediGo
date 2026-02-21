"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Check,
  Ban,
  Loader2,
  User,
  Search
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { updateDoctorActiveStatus } from "@/actions/admin"
import useFetch from "@/hooks/use-fetch"
import { toast } from "sonner"

export function VerifiedDoctors({ doctors }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [targetDoctor, setTargetDoctor] = useState(null)
  const [actionType, setActionType] = useState(null)

  const {
    loading,
    data,
    fn: submitStatusUpdate
  } = useFetch(updateDoctorActiveStatus)

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchTerm.toLowerCase()
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query)
    )
  })

  const handleStatusChange = async (doctor, suspend) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${suspend ? "suspend" : "reinstate"} ${doctor.name}?`
    )
    if (!confirmed || loading) return

    const formData = new FormData()
    formData.append("doctorId", doctor.id)
    formData.append("suspend", suspend ? "true" : "false")

    setTargetDoctor(doctor)
    setActionType(suspend ? "SUSPEND" : "REINSTATE")

    await submitStatusUpdate(formData)
  }

  useEffect(() => {
    if (data?.success && targetDoctor && actionType) {
      const actionVerb =
        actionType === "SUSPEND" ? "Suspended" : "Reinstated"

      toast.success(`${actionVerb} ${targetDoctor.name} successfully!`)
      setTargetDoctor(null)
      setActionType(null)
    }
  }, [data])

  return (
    <div className="space-y-6">

      <Card className="bg-slate-900 border border-slate-800 shadow-2xl">

        {/* HEADER */}
        <CardHeader className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Doctor Control Panel
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage active accounts, suspend access, or reinstate doctors.
              </CardDescription>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by name, specialty, or email..."
                className="pl-9 bg-slate-950 border border-slate-800 focus:border-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              {searchTerm
                ? "No doctors match your search."
                : "No verified doctors available."}
            </div>
          ) : (
            <div className="space-y-5">

              {filteredDoctors.map((doctor) => {
                const isSuspended =
                  doctor.verificationStatus === "REJECTED"

                return (
                  <Card
                    key={doctor.id}
                    className="bg-slate-950 border border-slate-800 hover:border-blue-600/40 transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                        {/* LEFT INFO */}
                        <div className="flex items-center gap-5">

                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full"></div>
                            <div className="relative bg-blue-600/10 p-4 rounded-xl">
                              <User className="h-6 w-6 text-blue-400" />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {doctor.name}
                            </h3>

                            <p className="text-sm text-slate-400">
                              {doctor.specialty} • {doctor.experience} years experience
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              {doctor.email}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT ACTIONS */}
                        <div className="flex items-center gap-4">

                          {isSuspended ? (
                            <>
                              <Badge
                                className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1"
                              >
                                Suspended
                              </Badge>

                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(doctor, false)
                                }
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {loading &&
                                targetDoctor?.id === doctor.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Reinstate
                              </Button>
                            </>
                          ) : (
                            <>
                              <Badge
                                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1"
                              >
                                Active
                              </Badge>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusChange(doctor, true)
                                }
                                disabled={loading}
                                className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                              >
                                {loading &&
                                targetDoctor?.id === doctor.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Ban className="h-4 w-4 mr-2" />
                                )}
                                Suspend
                              </Button>
                            </>
                          )}

                        </div>
                      </div>

                    </CardContent>
                  </Card>
                )
              })}

            </div>
          )}
        </CardContent>

      </Card>
    </div>
  )
}