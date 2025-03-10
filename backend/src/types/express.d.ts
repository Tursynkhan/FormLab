declare namespace Express {
  export interface Request {
    cookies: Record<string, string>;
  }

  export interface Response {
    cookie(name: string, value: string, options?: CookieOptions): this;
  }
}
