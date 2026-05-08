import { Response, CookieOptions } from 'express'

const COOKIE_NAME = 'token'

const baseOptions: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
}

export const setAuthCookie = (res: Response, token: string) => {
	res.cookie(COOKIE_NAME, token, {
		...baseOptions,
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	})
}

export const clearAuthCookie = (res: Response) => {
	res.clearCookie(COOKIE_NAME, baseOptions)
}
