"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Calendar,
  BarChart3,
  CreditCard,
  Loader2,
  AlertCircle,
  Coins,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { requestPayout } from "@/actions/payout";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

export function DoctorEarnings({ earnings, payouts = [] }) {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  const {
    thisMonthEarnings = 0,
    completedAppointments = 0,
    averageEarningsPerMonth = 0,
    availableCredits = 0,
    availablePayout = 0,
  } = earnings;

  const { loading, data, fn: submitPayoutRequest } =
    useFetch(requestPayout);

  const pendingPayout = payouts.find(
    (payout) => payout.status === "PROCESSING"
  );

  const handlePayoutRequest = async (e) => {
    e.preventDefault();

    if (!paypalEmail) {
      toast.error("PayPal email is required");
      return;
    }

    const formData = new FormData();
    formData.append("paypalEmail", paypalEmail);

    await submitPayoutRequest(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowPayoutDialog(false);
      setPaypalEmail("");
      toast.success("Payout request submitted successfully!");
    }
  }, [data]);

  const platformFee = availableCredits * 2;

  return (
    <div className="space-y-6">

      {/* ===================== Earnings Overview ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Available Credits
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {availableCredits}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ${availablePayout.toFixed(2)} available for payout
                </p>
              </div>
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <Coins className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  This Month
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  ${thisMonthEarnings.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {completedAppointments}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  completed
                </p>
              </div>
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Avg / Month
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  ${averageEarningsPerMonth.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ===================== Payout Section ===================== */}
      <Card className="bg-slate-900 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
            Payout Management
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Current Payout Status */}
          <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Available for Payout
              </h3>

              {pendingPayout ? (
                <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PROCESSING
                </Badge>
              ) : (
                <Badge className="bg-blue-600/10 text-blue-400 border border-blue-600/30">
                  Available
                </Badge>
              )}
            </div>

            {!pendingPayout && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Available Credits</p>
                  <p className="text-white font-medium">
                    {availableCredits}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Payout Amount</p>
                  <p className="text-white font-medium">
                    ${availablePayout.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Platform Fee</p>
                  <p className="text-white font-medium">
                    ${platformFee.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {!pendingPayout && availableCredits > 0 && (
              <Button
                onClick={() => setShowPayoutDialog(true)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02]"
              >
                Request Payout for All Credits
              </Button>
            )}

            {availableCredits === 0 && !pendingPayout && (
              <div className="text-center py-6">
                <p className="text-slate-400">
                  No credits available for payout. Complete more appointments to earn credits.
                </p>
              </div>
            )}

          </div>

          {/* Payout Info Alert */}
          <Alert className="bg-slate-800/40 border border-slate-700">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-sm text-slate-300">
              <strong>Payout Structure:</strong> You earn $8 per credit.
              Platform fee is $2 per credit. Payouts are processed via PayPal.
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>

      {/* ===================== Dialog ===================== */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent className="bg-slate-900 border border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Request Payout
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Request payout for all your available credits
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayoutRequest} className="space-y-6">

            <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Available credits:</span>
                <span className="text-white">{availableCredits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net payout:</span>
                <span className="text-blue-400 font-medium">
                  ${availablePayout.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayoutDialog(false)}
                disabled={loading}
                className="border-slate-700"
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
                    Requesting...
                  </>
                ) : (
                  "Request Payout"
                )}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}