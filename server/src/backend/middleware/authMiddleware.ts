import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // Import the VerifyErrors and JwtPayload types
import config from './config';

export default function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization || req.cookies.jwt;

  if (!token) {
    res.status(401).json({ message: 'Authentication failed. Token missing.' });
    return; // Ensure a response is sent and exit the function
  }

  jwt.verify(token, config.jwtSecret, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }

    // Set the JWT token as a cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour

    (req as any).user = decoded;// Attach user data to the request (use an empty object if decoded is undefined)
    return next();
  });

  return next();
}
