"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export function AppointmentFilterButton() {
  const toggleFilterSection = () => {
    const filterSection = document.getElementById('filter-section')
    if (filterSection) {
      filterSection.classList.toggle('hidden')
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