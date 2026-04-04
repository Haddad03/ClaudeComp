"use client"

import { useEffect } from "react"
import { useAppStore } from "@/store/appStore"

export function ThemeApplier() {
  const { theme } = useAppStore()
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])
  return null
}
