'use server'
import { LoginActionResponse, LoginFormData } from "../../types"
import { loginHandler } from "./login-handler"

export async function login(_state: LoginActionResponse | null, formData: FormData) {
    const rawData: LoginFormData = {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? '')
    }
    return await loginHandler(rawData)

}