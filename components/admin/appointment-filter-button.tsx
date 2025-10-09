"use client"

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export function AppointmentFilterButton() {
  const toggleFilterSection = () => {
    const filterSection = document.getElementById('filter-section')
    if (filterSection) {
      filterSection.classList.toggle('hidden')
      
      // Scroll to the filter section if it's being shown
      if (!filterSection.classList.contains('hidden')) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  return (
    <Button 
      onClick={toggleFilterSection}
      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
    >
      <Filter className="w-4 h-4 ml-2" />
      تصفية
    </Button>
  )
}