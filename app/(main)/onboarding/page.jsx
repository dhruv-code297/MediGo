"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import {
  User,
  Stethoscope,
  Loader2,
  ArrowLeft
} from "lucide-react"

import { setUserRole } from "@/actions/onboarding"
import { SPECIALTIES } from "@/lib/specialities"
import useFetch from "@/hooks/use-fetch"
// import { doctorFormSchema } from "@/lib/schema"

export default function OnboardingPage() {
  const [step, setStep] = useState("choose-role")
  const router = useRouter()

  const { loading, data, fn: submitUserRole } = useFetch(setUserRole)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: "",
      credentialUrl: "",
      description: ""
    }
  })

  const specialtyValue = watch("specialty")

  useEffect(() => {
    if (data?.success) {
      router.push(data.redirect)
    }
  }, [data])

  const handlePatientSelection = async () => {
    if (loading) return
    const formData = new FormData()
    formData.append("role", "PATIENT")
    await submitUserRole(formData)
  }

  const onDoctorSubmit = async (formDataValues) => {
    if (loading) return

    const formData = new FormData()
    formData.append("role", "DOCTOR")
    formData.append("specialty", formDataValues.specialty)
    formData.append("experience", formDataValues.experience)
    formData.append("credentialUrl", formDataValues.credentialUrl)
    formData.append("description", formDataValues.description)

    await submitUserRole(formData)
  }

  /* =========================
     ROLE SELECTION SCREEN
  ==========================*/

  if (step === "choose-role") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 w-full max-w-5xl"
        >

          {/* PATIENT */}
          <Card
            onClick={() => !loading && handlePatientSelection()}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-600/40 hover:-translate-y-2 transition-all duration-300"
          >
            <CardContent className="p-10 text-center space-y-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600/10">
                <User className="h-8 w-8 text-blue-400" />
              </div>

              <CardTitle className="text-2xl">
                Join as Patient
              </CardTitle>

              <CardDescription className="text-slate-400">
                Book consultations, access verified doctors,
                and manage your healthcare digitally.
              </CardDescription>

              <Button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue as Patient"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* DOCTOR */}
          <Card
            onClick={() => !loading && setStep("doctor-form")}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-600/40 hover:-translate-y-2 transition-all duration-300"
          >
            <CardContent className="p-10 text-center space-y-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600/10">
                <Stethoscope className="h-8 w-8 text-blue-400" />
              </div>

              <CardTitle className="text-2xl">
                Join as Doctor
              </CardTitle>

              <CardDescription className="text-slate-400">
                Build your professional profile, manage
                appointments, and provide secure consultations.
              </CardDescription>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Continue as Doctor
              </Button>
            </CardContent>
          </Card>

        </motion.div>
      </div>
    )
  }

  /* =========================
     DOCTOR FORM
  ==========================*/

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-900 border border-slate-800">
          <CardContent className="p-10 space-y-8">

            <div>
              <CardTitle className="text-3xl mb-2">
                Complete Doctor Profile
              </CardTitle>
              <CardDescription className="text-slate-400">
                Provide your credentials for verification and activation.
              </CardDescription>
            </div>

            <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">

              {/* SPECIALTY */}
              <div className="space-y-2">
                <Label>Medical Specialty</Label>
                <Select
                  value={specialtyValue}
                  onValueChange={(value) => setValue("specialty", value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((spec) => (
                      <SelectItem key={spec.name} value={spec.name}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialty && (
                  <p className="text-sm text-red-500">{errors.specialty.message}</p>
                )}
              </div>

              {/* EXPERIENCE */}
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  className="bg-slate-800 border-slate-700"
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience.message}</p>
                )}
              </div>

              {/* CREDENTIAL URL */}
              <div className="space-y-2">
                <Label>Credential Document URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/degree.pdf"
                  className="bg-slate-800 border-slate-700"
                  {...register("credentialUrl")}
                />
                {errors.credentialUrl && (
                  <p className="text-sm text-red-500">{errors.credentialUrl.message}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label>Professional Description</Label>
                <Textarea
                  rows="4"
                  placeholder="Describe your expertise and services..."
                  className="bg-slate-800 border-slate-700"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("choose-role")}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
