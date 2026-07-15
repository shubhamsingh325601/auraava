import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/auth'

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.['admin-session'] || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' })
    }

    const session = await verifyToken(token)

    if (!session || !session.isAdmin) {
        return res.status(401).json({ error: 'Authentication required' })
    }

    next()
}
