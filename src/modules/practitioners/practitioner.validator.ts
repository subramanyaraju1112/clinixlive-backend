import z from "zod";

export const createPractitionerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
  name: z.string().min(3, "Name is required"),
  specialization: z.string().min(3, "Specialization is required"),
});

export type CreatePractitionerInput = z.infer<typeof createPractitionerSchema>;
