import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import practitionerModel from "../practitioners/practitioner.model.js";
import { createPractitionerSchema } from "../practitioners/practitioner.validator.js";
import { ZodError } from "zod";
import { loginPractitionerSchema } from "./auth.validator.js";

const createPractitioner = async (req: Request, res: Response) => {
  try {
    const data = createPractitionerSchema.parse(req.body);
    const existing = await practitionerModel.findOne({ email: data.email });

    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const practitioner = await practitionerModel.create({
      ...data,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Practitioner created successfully",
      id: practitioner.practitionerId,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.issues });
    }
    return res
      .status(500)
      .json({ message: "Error creating an account", error });
  }
};

const loginPractitioner = async (req: Request, res: Response) => {
  try {
    const data = loginPractitionerSchema.parse(req.body);
    const findPractitioner = await practitionerModel
      .findOne({ email: data.email })
      .select("+password");
    if (!findPractitioner) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(
      data.password,
      findPractitioner.password
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    return res.status(200).json({
      message: "Login successful",
      practitioner: {
        id: findPractitioner.practitionerId,
        name: findPractitioner.name,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.issues });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export default { createPractitioner, loginPractitioner };
