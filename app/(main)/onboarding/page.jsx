"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import { toast } from "sonner"

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

export default function OnboardingPage() {
  const [step, setStep] = useState("choose-role")
  const router = useRouter()

  const { loading, data, error, fn: submitUserRole } =
    useFetch(setUserRole)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      specialty: "",
      experience: "",
      credentialUrl: "",
      description: ""
    }
  })

  useEffect(() => {
    if (data?.success) {
      toast.success("Profile submitted successfully!")
      router.push(data.redirect)
    }
  }, [data, router])

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong.")
    }
  }, [error])

  const handlePatientSelection = async () => {
    if (loading) return
    const formData = new FormData()
    formData.append("role", "PATIENT")
    await submitUserRole(formData)
  }

  const onDoctorSubmit = async (values) => {
    console.log("FORM VALUES:", values) // ✅ fixed console log

    if (loading) return

    const formData = new FormData()
    formData.append("role", "DOCTOR")
    formData.append("specialty", values.specialty)
    formData.append("experience", values.experience)
    formData.append("credentialUrl", values.credentialUrl)
    formData.append("description", values.description)

    await submitUserRole(formData)
  }

  /* =========================
      ROLE SELECTION SCREEN
  ==========================*/
  if (step === "choose-role") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 w-full max-w-5xl"
        >

          <Card
  onClick={() => !loading && handlePatientSelection()}
  className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-600/40 hover:-translate-y-2 transition-all duration-300 shadow-lg"
>
  <CardContent className="pt-8 pb-8 px-8 flex flex-col items-center text-center space-y-6">

    {/* Icon */}
    <div className="p-5 bg-blue-600/10 rounded-2xl">
      <User className="h-8 w-8 text-blue-400" />
    </div>

    {/* Title */}
    <CardTitle className="text-2xl font-semibold text-white">
      Join as a Patient
    </CardTitle>

    {/* Description */}
    <CardDescription className="text-slate-400 max-w-xs">
      Book appointments, consult verified doctors, and manage your
      healthcare journey seamlessly.
    </CardDescription>

    {/* Button */}
    <Button
      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all"
      disabled={loading}
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

         <Card
  className="bg-slate-900 border border-slate-800 hover:border-blue-600/40 hover:-translate-y-2 cursor-pointer transition-all duration-300 shadow-lg"
  onClick={() => !loading && setStep("doctor-form")}
>
  <CardContent className="pt-8 pb-8 px-8 flex flex-col items-center text-center space-y-6">

    {/* Icon */}
    <div className="p-5 bg-blue-600/10 rounded-2xl">
      <Stethoscope className="h-8 w-8 text-blue-400" />
    </div>

    {/* Title */}
    <CardTitle className="text-2xl font-semibold text-white">
      Join as a Doctor
    </CardTitle>

    {/* Description */}
    <CardDescription className="text-slate-400 max-w-xs">
      Create your professional profile, set your availability,
      and provide secure consultations to patients.
    </CardDescription>

    {/* Button */}
    <Button
      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all"
      disabled={loading}
    >
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
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
       <Card className="relative bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">

  {/* Soft Blue Glow Background */}
  <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

  <CardContent className="relative p-12 space-y-10">

    {/* Header */}
    <div className="space-y-2">
      <CardTitle className="text-3xl font-bold text-white">
        Complete Doctor Profile
      </CardTitle>
      <CardDescription className="text-slate-400 text-base">
        Provide your professional credentials for verification and activation.
      </CardDescription>
    </div>

    <form
      onSubmit={handleSubmit(onDoctorSubmit)}
      className="space-y-8"
    >

      {/* Specialty */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Medical Specialty
        </Label>
        <Controller
          name="specialty"
          control={control}
          rules={{ required: "Specialty is required" }}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-blue-500 transition-all">
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                {SPECIALTIES.map((spec) => (
                  <SelectItem key={spec.name} value={spec.name}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.specialty && (
          <p className="text-sm text-red-500">
            {errors.specialty.message}
          </p>
        )}
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Years of Experience
        </Label>
        <Input
          type="number"
          {...register("experience", {
            required: "Experience is required",
            min: { value: 1, message: "Minimum 1 year required" },
            max: { value: 70, message: "Maximum 70 years allowed" }
          })}
          className="bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {errors.experience && (
          <p className="text-sm text-red-500">
            {errors.experience.message}
          </p>
        )}
      </div>

      {/* Credential URL */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Credential URL
        </Label>
        <Input
          type="url"
          placeholder="https://example.com/degree.pdf"
          {...register("credentialUrl", {
            required: "Credential URL is required"
          })}
          className="bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {errors.credentialUrl && (
          <p className="text-sm text-red-500">
            {errors.credentialUrl.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Professional Description
        </Label>
        <Textarea
          rows="4"
          placeholder="Describe your expertise and services..."
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 20,
              message: "Minimum 20 characters required"
            }
          })}
          className="bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center pt-6">

        <Button
          type="button"
          variant="outline"
          onClick={() => setStep("choose-role")}
          className="border-slate-700 hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
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