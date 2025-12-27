import z from "zod";

export const loginPractitionerSchema = z.object({
  email: z.string().email("Enter email address"),
  password: z.string(),
});

export type loginPractitionerInput = z.infer<typeof loginPractitionerSchema>;
