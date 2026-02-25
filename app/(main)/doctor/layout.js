 import React from 'react'
 import { PageHeader } from '@/components/page-header'
import { Stethoscope } from 'lucide-react'

 export const metadata = {
title: "Doctor Dashboard - Medigo",
description: "Access your personalized doctor dashboard on Medigo. Manage appointments, view patient information, and stay connected with your healthcare community.",
 }
 
 const DoctorDashboardLayout = ({ children }) => {
   return (
     <div className='container mx-auto px-4 py-8'>
      <PageHeader icon={<Stethoscope/>} title="Doctor Dashboard" />
        {children}
     </div>
   )
 }
 
 export default DoctorDashboardLayout
 