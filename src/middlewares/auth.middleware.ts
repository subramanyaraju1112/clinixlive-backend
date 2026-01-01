import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import practitionerModel from "../modules/practitioners/practitioner.model.js";

const checkAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check authentication header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    // check token
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // check the practitioner
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
