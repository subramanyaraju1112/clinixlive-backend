import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import practitionerModel from "../modules/practitioners/practitioner.model.js";

const checkAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const practitionerId = decoded.practitionerId as string;

    if (!practitionerId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const practitioner = await checkPractitionerInDB(practitionerId);

    if (!practitioner) {
      return res.status(401).json({ message: "Practitioner not found" });
    }
    req.practitioner = {
      practitionerId: practitioner.practitionerId,
      name: practitioner.name,
      email: practitioner.email,
    };
    next();
  } catch (error) {
    console.error("Authentication error", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const checkPractitionerInDB = async (practitionerId: string) => {
  const practitioner = await practitionerModel
    .findOne({ practitionerId })
    .select("-password");
  return practitioner;
};

export default checkAuthentication;
