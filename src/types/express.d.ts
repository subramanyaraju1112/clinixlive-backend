import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      practitioner?: {
        practitionerId: string;
        name: string;
        email: string;
      };
    }
  }
}

export {};