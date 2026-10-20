import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number | string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

  if (!token) {
    res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number | string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token tidak valid atau kadaluwarsa.' });
  }
};

// Middleware opsional untuk membatasi role tertentu
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role ? req.user.role.toUpperCase() : '';
    const normalizedRoles = roles.map(r => r.toUpperCase());

    if (!req.user || !normalizedRoles.includes(userRole)) {
      res.status(403).json({ message: 'Anda tidak memiliki hak akses untuk tindakan ini.' });
      return;
    }
    next();
  };
};