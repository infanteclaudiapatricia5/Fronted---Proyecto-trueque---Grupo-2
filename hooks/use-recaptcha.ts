import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { useCallback } from "react"

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getToken = useCallback(
    async (action: string = "submit"): Promise<string> => {
      if (!executeRecaptcha) {
        console.warn("reCAPTCHA not available, using test token")
        return "test_token"
      }

      try {
        const token = await executeRecaptcha(action)
        return token
      } catch (error) {
        console.error("Error executing reCAPTCHA:", error)
        return "test_token"
      }
    },
    [executeRecaptcha],
  )

  return { getToken }
}
