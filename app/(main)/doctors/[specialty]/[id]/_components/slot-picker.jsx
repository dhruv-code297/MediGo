"use client"

import { useState } from "react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

export function SlotPicker({ days, onSelectSlot, loading = false }) {
  const [selectedSlot, setSelectedSlot] = useState(null)

  const firstDayWithSlots =
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date

  const [activeTab, setActiveTab] = useState(firstDayWithSlots)

  const confirmSelection = () => {
    if (selectedSlot) onSelectSlot(selectedSlot)
  }

  return (
    <div className="space-y-8">

      {/* TABS */}
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl p-2 gap-2">

          {days.map((day) => (
            <TabsTrigger
              key={day.date}
              value={day.date}
              disabled={day.slots.length === 0}
              className={`
                rounded-lg px-4 py-2 transition-all
                data-[state=active]:bg-blue-600
                data-[state=active]:text-white
                ${
                  day.slots.length === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-slate-900"
                }
              `}
            >
              <div className="flex flex-col text-sm">
                <span>{format(new Date(day.date), "MMM d")}</span>
                <span className="text-xs opacity-70">
                  {format(new Date(day.date), "EEE")}
                </span>
              </div>

              {day.slots.length > 0 && (
                <div className="ml-3 bg-blue-600/10 text-blue-400 text-xs px-2 py-0.5 rounded">
                  {day.slots.length}
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* FADE TRANSITION BETWEEN DAYS */}
        <AnimatePresence mode="wait">
          {days.map((day) =>
            activeTab === day.date ? (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <TabsContent value={day.date} className="pt-6">

                  {loading ? (
                    <ShimmerGrid />
                  ) : day.slots.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No available slots for this day.
                    </div>
                  ) : (
                    <div className="space-y-4">

                      <h3 className="text-lg font-semibold text-white">
                        {day.displayDate}
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                        {day.slots.map((slot) => {
                          const isSelected =
                            selectedSlot?.startTime === slot.startTime

                          return (
                            <motion.div
                              key={slot.startTime}
                              whileTap={{ scale: 0.96 }}
                            >
                              <Card
                                onClick={() =>
                                  setSelectedSlot(slot)
                                }
                                className={`
                                  cursor-pointer
                                  border border-slate-800
                                  transition-all
                                  hover:border-blue-600/40
                                  ${
                                    isSelected
                                      ? "bg-blue-600/10 border-blue-600"
                                      : "bg-slate-900"
                                  }
                                `}
                              >
                                <CardContent className="p-3 flex items-center justify-center gap-2 relative">

                                  {/* SELECTION PULSE */}
                                  {isSelected && (
                                    <motion.div
                                      layoutId="slotHighlight"
                                      className="absolute inset-0 rounded-lg border-2 border-blue-600"
                                      initial={{ opacity: 0.6 }}
                                      animate={{ opacity: 1 }}
                                      transition={{
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        duration: 0.8
                                      }}
                                    />
                                  )}

                                  <Clock
                                    className={`h-4 w-4 ${
                                      isSelected
                                        ? "text-blue-400"
                                        : "text-slate-500"
                                    }`}
                                  />

                                  <span
                                    className={`text-sm font-medium ${
                                      isSelected
                                        ? "text-white"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {format(
                                      new Date(slot.startTime),
                                      "h:mm a"
                                    )}
                                  </span>

                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}

                      </div>
                    </div>
                  )}

                </TabsContent>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </Tabs>

      {/* CONTINUE BUTTON */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/* SHIMMER GRID */
function ShimmerGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-lg bg-slate-800 relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer" />
        </div>
      ))}
    </div>
  )
}