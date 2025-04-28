import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_TOKEN } from "./config";
import { AuthenticatedRequest } from "./types"; // adjust path accordingly

export const middleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const header = req.headers['authorization'];

      if (!header) {
            res.status(401).json({ message: 'Authorization header missing' });
            return;
      }

      try {
            const decoded = jwt.verify(header as string, JWT_TOKEN);

            if (typeof decoded === 'string') {
                  res.status(401).json({ message: 'Unauthorized' });
                  return;
            }
            req.userId = (decoded as JwtPayload).id;
            next();
      } catch (err) {
            res.status(401).json({ message: 'Invalid token' });
      }
}
