import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { SPECIALTIES } from "@/lib/specialities"

export default async function DoctorsPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Find Your Doctor
        </h1>
        <p className="text-slate-400 text-lg">
          Browse by specialty or explore available healthcare professionals.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {SPECIALTIES.map((specialty) => (
          <Link
            key={specialty.name}
            href={`/doctors/${specialty.name}`}
            className="group"
          >
            <Card
              className="
                bg-slate-900 
                border border-slate-800 
                hover:border-blue-600/40 
                transition-all 
                duration-300 
                hover:-translate-y-1
                h-full
              "
            >
              <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">

                {/* ICON */}
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full"></div>

                  <div className="relative w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    {specialty.icon}
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {specialty.name}
                </h3>

              </CardContent>
            </Card>
          </Link>
        ))}

      </div>
    </div>
  )
}