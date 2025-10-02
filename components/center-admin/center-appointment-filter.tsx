"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CenterAppointmentFilterProps {
  clinics: {
    id: string
    name: string
  }[]
}

export function CenterAppointmentFilter({ clinics }: CenterAppointmentFilterProps) {
  const [status, setStatus] = useState("")
  const [clinicId, setClinicId] = useState("")

  const applyFilter = () => {
    // This is where the filter logic would be implemented
    // For now, we'll just show a toast message
    toast.info("Filter functionality would be implemented here", {
      description: `Filtering by status: ${status || "all"} and clinic: ${clinicId || "all"}`
    })
  }

  return (
    <div id="filter-section" className="hidden">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select 
                className="w-full border rounded-md px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">جميع الحالات</option>
                <option value="pending">معلق</option>
                <option value="approved">مقبول</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العيادة</label>
              <select 
                className="w-full border rounded-md px-3 py-2"
                value={clinicId}
                onChange={(e) => setClinicId(e.target.value)}
              >
                <option value="">جميع العيادات</option>
                {clinics && clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-end">
              <Button 
                className="w-full"
                onClick={applyFilter}
              >
                تطبيق التصفية
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}