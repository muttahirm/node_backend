// import { UserRole } from '../modules/users/user.model.ts';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: import('../modules/users/user.model.ts').UserRole;
      };

      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
