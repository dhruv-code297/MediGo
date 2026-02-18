import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import React from "react"
import { Button } from "./ui/button"

export function PageHeader({
  icon,
  title,
  backLink = "/",
  backLabel = "Back to Home",
}) {
  return (
    <div className="relative flex flex-col gap-6 mb-12">

      {/* BACK BUTTON */}
      <Link href={backLink}>
        <Button
          variant="outline"
          size="sm"
          className="w-fit border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-blue-600/40 transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-2 text-blue-400" />
          {backLabel}
        </Button>
      </Link>

      {/* TITLE SECTION */}
      <div className="flex items-end gap-4 relative">

        {icon && (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-blue-600/10 blur-2xl rounded-full"></div>

            <div className="relative text-blue-400">
              {React.cloneElement(icon, {
                className: "h-12 md:h-14 w-12 md:w-14",
              })}
            </div>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
    </div>
  )
}
