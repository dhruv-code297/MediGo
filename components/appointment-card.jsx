"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  Video,
  Stethoscope,
  X,
  Edit,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cancelAppointment,
  addAppointmentNotes,
  markAppointmentCompleted,
} from "@/actions/doctor";
import { generateVideoToken } from "@/actions/appointments";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();

  const {
    loading: cancelLoading,
    fn: submitCancel,
    data: cancelData,
  } = useFetch(cancelAppointment);

  const {
    loading: notesLoading,
    fn: submitNotes,
    data: notesData,
  } = useFetch(addAppointmentNotes);

  const {
    loading: tokenLoading,
    fn: submitTokenRequest,
    data: tokenData,
  } = useFetch(generateVideoToken);

  const {
    loading: completeLoading,
    fn: submitMarkCompleted,
    data: completeData,
  } = useFetch(markAppointmentCompleted);

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") {
      return false;
    }
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);
    return now >= appointmentEndTime;
  };

  const isAppointmentActive = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);

    return (
      (appointmentTime.getTime() - now.getTime() <= 30 * 60 * 1000 &&
        now < appointmentTime) ||
      (now >= appointmentTime && now <= appointmentEndTime)
    );
  };

  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;

  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
  const otherPartyIcon =
    userRole === "DOCTOR" ? (
      <User className="h-5 w-5 text-blue-400" />
    ) : (
      <Stethoscope className="h-5 w-5 text-blue-400" />
    );

  /* -------- SUCCESS HANDLERS (UNCHANGED) -------- */

  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Appointment cancelled successfully");
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [cancelData]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Appointment marked as completed");
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [completeData]);

  useEffect(() => {
    if (notesData?.success) {
      toast.success("Notes saved successfully");
      setAction(null);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [notesData]);

  useEffect(() => {
    if (tokenData?.success) {
      router.push(
        `/video-call?sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`
      );
    } else if (tokenData?.error) {
      setAction(null);
    }
  }, [tokenData]);

  return (
    <>
      {/* ===== CARD ===== */}
      <Card className="bg-slate-900 border border-slate-800 hover:border-blue-600/40 transition-all shadow-md hover:shadow-blue-600/10">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
              <div className="bg-blue-600/10 rounded-full p-3">
                {otherPartyIcon}
              </div>

              <div>
                <h3 className="text-white font-semibold text-lg">
                  {userRole === "DOCTOR"
                    ? otherParty.name
                    : `Dr. ${otherParty.name}`}
                </h3>

                {userRole === "DOCTOR" && (
                  <p className="text-slate-400 text-sm">
                    {otherParty.email}
                  </p>
                )}

                {userRole === "PATIENT" && (
                  <p className="text-slate-400 text-sm">
                    {otherParty.specialty}
                  </p>
                )}

                <div className="mt-3 space-y-1 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDateTime(appointment.startTime)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatTime(appointment.startTime)} -{" "}
                    {formatTime(appointment.endTime)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <Badge
                className={
                  appointment.status === "COMPLETED"
                    ? "bg-green-600/10 text-green-400 border border-green-600/30"
                    : appointment.status === "CANCELLED"
                    ? "bg-red-600/10 text-red-400 border border-red-600/30"
                    : "bg-blue-600/10 text-blue-400 border border-blue-600/30"
                }
              >
                {appointment.status}
              </Badge>

              <div className="flex gap-2 flex-wrap">
                {canMarkCompleted() && (
                  <Button
                    size="sm"
                    onClick={handleMarkCompleted}
                    disabled={completeLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {completeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </>
                    )}
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="border-slate-700 hover:border-blue-600 hover:bg-slate-800"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== DIALOG ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Appointment Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {appointment.status === "SCHEDULED"
                ? "Manage your upcoming appointment"
                : "View appointment information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">

            {appointment.patientDescription && (
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                <p className="text-white whitespace-pre-line">
                  {appointment.patientDescription}
                </p>
              </div>
            )}

            {appointment.status === "SCHEDULED" && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={
                  !isAppointmentActive() ||
                  action === "video" ||
                  tokenLoading
                }
                onClick={handleJoinVideoCall}
              >
                {tokenLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Video Call...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    {isAppointmentActive()
                      ? "Join Video Call"
                      : "Available 30 minutes before appointment"}
                  </>
                )}
              </Button>
            )}

            {/* NOTES */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-slate-400">
                  Doctor Notes
                </h4>

                {userRole === "DOCTOR" &&
                  action !== "notes" &&
                  appointment.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAction("notes")}
                      className="text-blue-400 hover:bg-blue-600/10"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {appointment.notes ? "Edit" : "Add"}
                    </Button>
                  )}
              </div>

              {userRole === "DOCTOR" && action === "notes" ? (
                <>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      className="border-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {notesLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save Notes"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg min-h-[80px]">
                  {appointment.notes ? (
                    <p className="text-white whitespace-pre-line">
                      {appointment.notes}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic">
                      No notes added yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {canMarkCompleted() && (
                <Button
                  onClick={handleMarkCompleted}
                  disabled={completeLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {completeLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}

              {appointment.status === "SCHEDULED" && (
                <Button
                  variant="outline"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="border-red-600/30 text-red-400 hover:bg-red-600/10"
                >
                  {cancelLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  )}
                </Button>
              )}
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}