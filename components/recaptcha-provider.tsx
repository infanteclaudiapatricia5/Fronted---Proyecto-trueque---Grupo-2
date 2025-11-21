"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import type { ReactNode } from "react"
import { useEffect } from "react"

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Lf7ZRQsAAAAAHUI3Jd8esdqfFBmiCxExeXWb7_z"

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    console.log("🔑 reCAPTCHA Site Key cargada:", RECAPTCHA_SITE_KEY)
    console.log("🔑 Desde .env.local:", process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
    
    const existingScripts = document.querySelectorAll('script[src*="recaptcha"]')
    console.log("📜 Scripts de reCAPTCHA encontrados:", existingScripts.length)
    existingScripts.forEach((script, index) => {
      console.log(`   Script ${index + 1}:`, script.getAttribute('src'))
      const src = script.getAttribute('src')
      if (src && !src.includes(RECAPTCHA_SITE_KEY)) {
        console.log("⚠️  Script de reCAPTCHA con clave incorrecta detectado, eliminando...")
        script.remove()
      }
    })
    
    if (typeof window !== 'undefined' && (window as any).grecaptcha) {
      console.log("🔄 Limpiando grecaptcha global...")
      delete (window as any).grecaptcha
    }
  }, [])

  return (
    <GoogleReCaptchaProvider 
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
