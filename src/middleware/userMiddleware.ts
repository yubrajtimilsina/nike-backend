import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/config";
import User from "../database/models/userModel";

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

interface IExtendedRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    id: string;
  };
}

class UserMiddleware {
  async isUserLoggedIn(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    const token = req.headers.authorization
    if (!token) {
      res.status(403).json({
        message: "Token must be provided",
      });
      return;
    }

    try {
      const result = jwt.verify(token, envConfig.jwtSecret as string) as {
        userId?: string;
      };

      if (!result?.userId) {
        res.status(400).json({
          message: "Invalid token payload: missing userId",
        });
        return;
      }

      const userData = await User.findByPk(result.userId);
      if (!userData) {
        res.status(404).json({
          message: "No user found with the provided userId",
        });
        return;
      }

      const { password, ...userWithoutPassword } = userData.toJSON();
      req.user = userWithoutPassword;
      next();
    } catch (error) {
      res.status(403).json({
        message: "Invalid token",
      });
    }
  }

  accessTo(...roles: Role[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You do not have permission to access this resource",
        });
        return;
      }
      next();
    };
  }
}

export default new UserMiddleware;
