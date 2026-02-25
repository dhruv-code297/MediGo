import { User, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  return (
    <Card className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="flex items-start gap-5">

          {/* Avatar Section */}
          <div className="relative w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0 border border-slate-800">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-blue-400" />
            )}

            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md opacity-0 hover:opacity-100 transition-all"></div>
          </div>

          {/* Content Section */}
          <div className="flex-1">

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h3 className="font-semibold text-white text-lg tracking-tight">
                Dr. {doctor.name}
              </h3>

              <Badge
                variant="outline"
                className="bg-blue-600/10 border border-blue-600/30 text-blue-400 self-start"
              >
                <Star className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>

            {/* Specialty & Experience */}
            <p className="text-sm text-slate-400 mb-2">
              {doctor.specialty} • {doctor.experience} years experience
            </p>

            {/* Description */}
            <div className="mt-4 line-clamp-2 text-sm text-slate-500 mb-5 leading-relaxed">
              {doctor.description}
            </div>

            {/* CTA Button */}
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 shadow-md"
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
  );
}