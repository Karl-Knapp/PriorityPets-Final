import keys from "./config/keys.js";
import path from "path";
import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import processUsers from "./cron/petProcessing.js";

// Database
dotenv.config();
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("DB connected!"))
  .catch((err) => console.error(err));

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(keys.app.apiUrl, router);
// add the following
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.all("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

const port = keys.app.port;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

cron.schedule("0 0 * * *", processUsers); // Executes at 00:00 (midnight) every day
