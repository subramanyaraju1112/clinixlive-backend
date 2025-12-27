import jwt from "jsonwebtoken";

const generateToken = (practitionerId: string): string => {
  return jwt.sign({ practitionerId }, process.env.JWT_SECRET as string);
};
export default generateToken;

