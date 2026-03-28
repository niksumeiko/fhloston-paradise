export interface LoginFormData {
    email: string;
    password: string
}

export interface ActionResponse<T> {
    success: boolean;
    message: string;
    inputs?: T;
    user?: User,
    token?: string,
    errors?: {
        [K in keyof T]?: string[]
    }
}

export type LoginActionResponse = ActionResponse<LoginFormData>


export type User = {
    id: number;
    name: string;
    picture: string;
    email: string
}