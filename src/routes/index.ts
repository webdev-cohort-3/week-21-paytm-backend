import express from "express";
import userRouter from "./user";

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);

export default rootRouter;