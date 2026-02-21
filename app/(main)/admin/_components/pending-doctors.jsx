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
  X,
  User,
  Medal,
  FileText,
  ExternalLink
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { updateDoctorStatus } from "@/actions/admin"
import useFetch from "@/hooks/use-fetch"
import { BarLoader } from "react-spinners"

export function PendingDoctors({ doctors }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const {
    loading,
    data,
    fn: submitStatusUpdate
  } = useFetch(updateDoctorStatus)

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleCloseDialog = () => {
    setSelectedDoctor(null)
  }

  const handleUpdateStatus = async (doctorId, status) => {
    if (loading) return

    const formData = new FormData()
    formData.append("doctorId", doctorId)
    formData.append("status", status)

    await submitStatusUpdate(formData)
  }

  useEffect(() => {
    if (data?.success) {
      handleCloseDialog()
    }
  }, [data])

  return (
    <div className="space-y-6">

      {/* MAIN CARD */}
      <Card className="bg-slate-900 border border-slate-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Pending Doctor Verifications
          </CardTitle>
          <CardDescription className="text-slate-400">
            Review submitted applications and verify qualified professionals.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No pending verification requests at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="bg-slate-950 border border-slate-800 hover:border-blue-600/40 transition-all duration-300"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      {/* LEFT SIDE */}
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-600/10 p-3 rounded-xl">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {doctor.specialty} • {doctor.experience} years experience
                          </p>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <Badge
                          variant="outline"
                          className="bg-blue-600/10 border-blue-600/30 text-blue-400"
                        >
                          Pending
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(doctor)}
                          className="border-slate-700 hover:bg-slate-800"
                        >
                          View Details
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DETAILS DIALOG */}
      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-3xl bg-slate-900 border border-slate-800">

            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                Doctor Verification Details
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Carefully review credentials before making a decision.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-4">

              {/* BASIC INFO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoBlock
                  label="Full Name"
                  value={selectedDoctor.name}
                />
                <InfoBlock
                  label="Email"
                  value={selectedDoctor.email}
                />
                <InfoBlock
                  label="Application Date"
                  value={format(new Date(selectedDoctor.createdAt), "PPP")}
                />
              </div>

              <Separator className="bg-slate-800" />

              {/* PROFESSIONAL DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Medal className="h-5 w-5" />
                  <h3 className="font-semibold text-white">
                    Professional Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoBlock
                    label="Specialty"
                    value={selectedDoctor.specialty}
                  />

                  <InfoBlock
                    label="Years of Experience"
                    value={`${selectedDoctor.experience} years`}
                  />

                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-400 mb-1">
                      Credentials
                    </p>
                    <a
                      href={selectedDoctor.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                    >
                      View Credential Document
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* DESCRIPTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold text-white">
                    Service Description
                  </h3>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-400 text-sm whitespace-pre-line">
                  {selectedDoctor.description}
                </div>
              </div>

            </div>

            {loading && <BarLoader width={"100%"} color="#2563eb" />}

            <DialogFooter className="flex justify-between pt-4">

              <Button
                variant="destructive"
                onClick={() =>
                  handleUpdateStatus(selectedDoctor.id, "REJECTED")
                }
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>

              <Button
                onClick={() =>
                  handleUpdateStatus(selectedDoctor.id, "VERIFIED")
                }
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>

            </DialogFooter>

          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

/* Small reusable info block (keeps code structured, not reduced) */
function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  )
}