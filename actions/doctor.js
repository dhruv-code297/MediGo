"use server"; 
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setAvailabilitySlots(formData){
    const {userId} = await auth();
    if(!userId) return new Error("Unauthorized");

try {
    const doctor = await db.user.findUnique({
        where:{
            clerkUserId: userId,
            role: "DOCTOR",
        }
    })
    if(!doctor) return new Error("Doctor not found");

    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
     
    if(!startTime || !endTime) return new Error("Start time and end time are required");
    if(startTime >= endTime) return new Error("Start time must be before end time");

    const existingSlots = await db.availability.findMany({
        where:{
            doctorId: doctor.id,
        }
    })
    if(existingSlots.length > 0) {
        const slotsWithNoAppointments = existingSlots.filter(
            (slot) => !slot.appointment
        )
        if(slotsWithNoAppointments.length > 0) {
            await db.availability.deleteMany({
                where:{
                    id:{
                        in: slotsWithNoAppointments.map((slot) => slot.id),
                    }
                }
            })
        }
    }

    const newSlot = await db.availability.create({
        data:{
            doctorId: doctor.id,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status: "AVAILABLE"
        }
    })
    revalidatePath("/doctor")
    return {success: true, slot: newSlot}
} catch (error) {
    throw new Error("Failed to set availability: " + error.message);
}
}

export async function getDoctorAvailability(){
    const {userId} = await auth();
    if(!userId) return new Error("Unauthorized");
    try {
        const doctor = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role: "DOCTOR",
            }
        })
        if(!doctor) return new Error("Doctor not found");

        const availability = await db.availability.findMany({
            where:{
                doctorId: doctor.id,
            },
            orderBy:{
                startTime: "asc",
            }
        })
        return {slots: availability};
    } catch (error) {
        throw new Error("Failed to get doctor availability: " + error.message);
    }
}

export async function getDoctorAppointments(){}