import { http, HttpResponse } from 'msw'

export const handlers = [
    http.post('http://localhost:3001/api/login', () => {
        return HttpResponse.json({
            user: { id: '1', email: 'test@example.com', name: 'John Doe' },
            token: 'mock-jwt-token',
            success: true,
            message: 'Login successful'
        })
    }),
]