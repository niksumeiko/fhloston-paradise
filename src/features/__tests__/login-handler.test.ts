import { describe, expect, it } from 'vitest'
import { loginHandler } from '../lib/login-handler'
import { server } from '../../mocks/node'
import { http, HttpResponse } from 'msw'



const validPassengers = [
    { id: 1, name: 'Korben Dallas', email: 'korben@fhloston.com', password: 'multipass' },
    { id: 2, name: 'Leeloo', email: 'leeloo@fhloston.com', password: 'leeloo123' },
    { id: 3, name: 'Ruby Rhod', email: 'ruby@fhloston.com', password: 'greenrocks' }
]

const zorgsWorkers = [
    { id: 10, name: 'Zorg', email: 'zorg@evil.com', password: 'iamzorg' },
    { id: 11, name: 'Zorg Worker 1', email: 'worker1@evil.com', password: 'destroy1' },
    { id: 12, name: 'Zorg Worker 2', email: 'worker2@evil.com', password: 'destroy2' },
]

describe('loginHandler', () => {
    it('returns validation error for invalid input', async () => {
        const result = await loginHandler({
            email: 'bad-email',
            password: '123'
        })

        expect(result.success).toBe(false)
        expect(result?.errors?.email).toBeDefined()
    })

    it('returns success when loginService succeeds', async () => {
        const result = await loginHandler({
            email: 'test@example.com',
            password: '123456'
        })
        expect(result.success).toBe(true)
    })

    it('guarantees Korben, Leeloo and Ruby Rhod board the ship', async () => {
        for (const passenger of validPassengers) {
            const result = await loginHandler({
                email: passenger.email,
                password: passenger.password
            })
            expect(result.success, `${passenger.name} should be allowed to board`).toBe(true)
        }
    })

    it("prevents Zorg's workers from boarding — their tickets are fake", async () => {
        server.use(http.post('http://localhost:3001/api/login', () => {
            return HttpResponse.json({
                message: 'Invalid credentials'
            }, { status: 401 })
        }))
        for (const worker of zorgsWorkers) {
            const result = await loginHandler({
                email: worker.email,
                password: worker.password
            })

            expect(result.success, `${worker.name} must not be allowed to board`).toBe(false)
            expect(result.message).toBe('Login failed. Please try again')
        }
    })
})