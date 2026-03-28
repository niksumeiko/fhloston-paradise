
import { z } from 'zod'
import { LoginActionResponse, LoginFormData } from "../../types"
import { loginSchema } from "./login-schema"
import { loginService } from './login-service'

// Guarantee Korben Dallas, Leeloo, and Ruby Rhod access to the ship — 
// they have tickets with valid access credentials.

// Prevent Zorg’s workers from entering the ship.They faked tickets(and themselves).

//   Otherwise, if the authentication doesn’t work correctly, the world is in danger.
// Zorg’s people are forearmed with weapons and ready to destroy the party.
export async function loginHandler(data: LoginFormData): Promise<LoginActionResponse> {
    const validated = loginSchema.safeParse(data)
    if (!validated.success) {
        return {
            success: false,
            message: 'Please fix all errors',
            errors: z.flattenError(validated.error).fieldErrors
        }
    }

    try {
        const { email, password } = validated.data
        const result = await loginService(email, password)
        return result
    } catch {
        return {
            success: false,
            message: 'Login failed. Please try again'
        }
    }

}