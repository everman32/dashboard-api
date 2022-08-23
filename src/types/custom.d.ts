declare namespace Express {
  export interface Request {
    user: string;
  }
}

declare namespace jsonwebtoken {
  export interface JWTPayload {
    email: string;
  }
}
