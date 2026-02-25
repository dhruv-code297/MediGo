"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  User,
  DollarSign,
  Mail,
  Stethoscope,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { approvePayout } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

export function PendingPayouts({ payouts }) {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const { loading, data, fn: submitApproval } =
    useFetch(approvePayout);

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
  };

  const handleApprovePayout = (payout) => {
    setSelectedPayout(payout);
    setShowApproveDialog(true);
  };

  const confirmApproval = async () => {
    if (!selectedPayout || loading) return;

    const formData = new FormData();
    formData.append("payoutId", selectedPayout.id);

    await submitApproval(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowApproveDialog(false);
      setSelectedPayout(null);
      toast.success("Payout approved successfully!");
    }
  }, [data]);

  const closeDialogs = () => {
    setSelectedPayout(null);
    setShowApproveDialog(false);
  };

  return (
    <div className="space-y-6">

      {/* ================= MAIN CARD ================= */}
      <Card className="bg-slate-900 border border-slate-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Pending Payouts
          </CardTitle>
          <CardDescription className="text-slate-400">
            Review and approve doctor payout requests
          </CardDescription>
        </CardHeader>

        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No pending payout requests at this time.
            </div>
          ) : (
            <div className="space-y-5">
              {payouts.map((payout) => (
                <Card
                  key={payout.id}
                  className="bg-slate-800/40 border border-slate-700 hover:border-blue-500/40 transition-all hover:shadow-lg"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                      {/* LEFT SIDE */}
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600/10 rounded-xl p-3">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">
                            Dr. {payout.doctor.name}
                          </h3>

                          <p className="text-sm text-slate-400">
                            {payout.doctor.specialty}
                          </p>

                          <div className="flex flex-wrap items-center gap-6 mt-3 text-sm text-slate-400">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-blue-400" />
                              <span>
                                {payout.credits} credits • $
                                {payout.netAmount.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-blue-400" />
                              <span className="text-xs">
                                {payout.paypalEmail}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 mt-2">
                            Requested{" "}
                            {format(
                              new Date(payout.createdAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex flex-col sm:flex-row gap-3 self-end lg:self-center">
                        <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit">
                          Pending
                        </Badge>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(payout)}
                            className="border-slate-700 hover:bg-slate-700/50"
                          >
                            View Details
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleApprovePayout(payout)}
                            className="bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.03]"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= DETAILS DIALOG ================= */}
      {selectedPayout && !showApproveDialog && (
        <Dialog open={!!selectedPayout} onOpenChange={closeDialogs}>
          <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Payout Request Details
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Review the payout request information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">

              {/* DOCTOR INFO */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-400" />
                  <h3 className="text-white font-medium">
                    Doctor Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-slate-400">Name</p>
                    <p className="text-white">
                      Dr. {selectedPayout.doctor.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white">
                      {selectedPayout.doctor.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Specialty</p>
                    <p className="text-white">
                      {selectedPayout.doctor.specialty}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Current Credits</p>
                    <p className="text-white">
                      {selectedPayout.doctor.credits}
                    </p>
                  </div>
                </div>
              </div>

              {/* PAYOUT DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                  <h3 className="text-white font-medium">
                    Payout Details
                  </h3>
                </div>

                <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 space-y-4">

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Credits to pay out:
                    </span>
                    <span className="text-white font-medium">
                      {selectedPayout.credits}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Gross amount:
                    </span>
                    <span className="text-white">
                      ${selectedPayout.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Platform fee:
                    </span>
                    <span className="text-white">
                      -${selectedPayout.platformFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-slate-700 pt-4 flex justify-between font-semibold">
                    <span className="text-white">Net payout:</span>
                    <span className="text-blue-400">
                      ${selectedPayout.netAmount.toFixed(2)}
                    </span>
                  </div>

                </div>
              </div>

            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeDialogs}
                className="border-slate-700"
              >
                Close
              </Button>

              <Button
                onClick={() => handleApprovePayout(selectedPayout)}
                disabled={
                  selectedPayout.doctor.credits <
                  selectedPayout.credits
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve Payout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ================= CONFIRM DIALOG ================= */}
      {showApproveDialog && selectedPayout && (
        <Dialog
          open={showApproveDialog}
          onOpenChange={() => setShowApproveDialog(false)}
        >
          <DialogContent className="bg-slate-900 border border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Confirm Payout Approval
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to approve this payout?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">

              <Alert className="bg-slate-800/40 border border-slate-700">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-slate-300">
                  This action will deduct credits and mark payout as processed.
                  This action cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Doctor:</span>
                  <span className="text-white">
                    Dr. {selectedPayout.doctor.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-blue-400 font-medium">
                    ${selectedPayout.netAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">PayPal:</span>
                  <span className="text-white text-sm">
                    {selectedPayout.paypalEmail}
                  </span>
                </div>
              </div>

            </div>

            {loading && (
              <BarLoader width={"100%"} color="#3b82f6" />
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
                disabled={loading}
                className="border-slate-700"
              >
                Cancel
              </Button>

              <Button
                onClick={confirmApproval}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Approval
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}