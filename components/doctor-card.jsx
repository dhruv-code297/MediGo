import { User, Star, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DoctorCard({ doctor }) {
  return (
    <Card
      className="
        bg-slate-900 
        border border-slate-800 
        hover:border-blue-600/40 
        transition-all 
        duration-300 
        hover:-translate-y-1
        shadow-xl
      "
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-5">

          {/* AVATAR */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full"></div>

            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="relative w-14 h-14 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="relative w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center border border-slate-700">
                <User className="h-6 w-6 text-blue-400" />
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1">

            {/* HEADER ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">

              <h3 className="text-lg font-semibold text-white">
                {doctor.name}
              </h3>

              <Badge
                className="
                  bg-emerald-500/10 
                  border border-emerald-500/30 
                  text-emerald-400 
                  px-3 py-1
                  flex items-center
                  gap-1
                "
              >
                <Star className="h-3 w-3" />
                Verified
              </Badge>
            </div>

            {/* META INFO */}
            <p className="text-sm text-slate-400 mb-2">
              {doctor.specialty} • {doctor.experience} years experience
            </p>

            {/* DESCRIPTION */}
            <div className="mt-3 line-clamp-2 text-sm text-slate-500">
              {doctor.description}
            </div>

            {/* CTA */}
            <Button
              asChild
              className="
                w-full 
                mt-5 
                bg-blue-600 
                hover:bg-blue-700 
                text-white
              "
            >
              <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                View Profile & Book
              </Link>
            </Button>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}