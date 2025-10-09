"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CenterAppointmentFilterProps {
  clinics: {
    id: string
    name: string
  }[]
}

// Add props for current filter values
interface CenterAppointmentFilterPropsWithFilters extends CenterAppointmentFilterProps {
  status?: string;
  clinicId?: string;
  date?: string;
}

export function CenterAppointmentFilter({ 
  clinics, 
  status = "",
  clinicId = "",
  date = ""
}: CenterAppointmentFilterPropsWithFilters) {
  return (
    <div id="filter-section" className="hidden">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <form 
            method="GET"
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select 
                name="status"
                className="w-full border rounded-md px-3 py-2"
                defaultValue={status}
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
                name="clinic"
                className="w-full border rounded-md px-3 py-2"
                defaultValue={clinicId}
              >
                <option value="">جميع العيادات</option>
                {clinics && clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الموعد</label>
              <input 
                type="date" 
                name="date"
                className="w-full border rounded-md px-3 py-2"
                defaultValue={date}
              />
            </div>
            <div className="flex items-end">
              <Button 
                type="submit"
                className="w-full"
              >
                تطبيق التصفية
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}