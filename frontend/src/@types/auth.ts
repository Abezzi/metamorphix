export type SignInCredential = {
    username: string
    password: string
}

export type SignInResponse = {
    token: string
    refreshToken: string
    username: string
    authority: string[]
    avatar: string
    email: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    username: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
