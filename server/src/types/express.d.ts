declare global {
  namespace Express {
    interface UserPayload {
      email: string;
      role: string;
      iat?: number;
      exp?: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
export {};
