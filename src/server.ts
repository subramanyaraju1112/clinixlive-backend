import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in PORT ${PORT}`);
  });
};

startServer();
