"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setUserRole(formData) {
   const { userId } = await auth();
   if (!userId) {
     throw new Error("User not authenticated");
   }
   //find user in db
   const user = await db.user.findUnique({
     where: {
       clerkUserId: userId, 
        },
    });
    if (!user) {
      throw new Error("User not found in database");
    }

    const role = formData.get("role");
    if(!role || !["PATIENT", "DOCTOR"].includes(role)) {
      throw new Error("Invalid role selected");
    }
    try {
        if(role==='PATIENT'){
            await db.user.update({
                where:{
                    clerkUserId:user.id,
                },
                data:{
                    role:"PATIENT",
                }             })
        
        revalidatePath("/");
        return{
            success:true,
            redirect:"/doctors"
        }
        }

        if(role==='DOCTOR'){
            const speciality = formData.get("speciality");
            const experience = parseInt(formData.get("experience"), 10);
            const credentialUrl= formData.get("credentialUrl");
            const description=formData.get("description");
            if(!speciality || !experience || !credential || !description){
                throw new Error("All fields are required for doctors");
            }
            await db.user.update({
                where:{ 
                    clerkUserId:user.id,        
                },
                data:{
                    role:"DOCTOR",
                    speciality,
                    experience,
                    credentialUrl,
                    description,
                    verificationStatus:"PENDING",
                }
            })
              revalidatePath("/");
        return{
            success:true,
            redirect:"/doctor/verification"
        }
        }
    } catch (error) {
        console.log("Error updating user role: ", error);
        throw new Error(`Failed to update user role: ${error.message}`);
    }
}

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        },
    });
    return user;
  } catch (error) {
    console.log("Error fetching user: ", error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}