import "server-only"

import { businessControllerGetMine } from "@/design/api/generated/server"
import { getCurrentUser } from "@/lib/auth/get-current-user"

export async function getDesignAccount() {
  const user = await getCurrentUser()

  if (!user) {
    return { user: null, business: null }
  }

  try {
    const businesses = await businessControllerGetMine()
    return { user, business: businesses[0] ?? null }
  } catch (error) {
    console.error("Failed to fetch current business:", error)
    return { user, business: null }
  }
}
