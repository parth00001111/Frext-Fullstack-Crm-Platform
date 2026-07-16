import express from "express"; 
import { Express } from "express"
import dealRouters from "./Routes/dealsRoute.ts"
import { type Request, type Response } from "express"
import authRouter from "./Routes/authRoutes"
import cors from "cors";
import taskRouters from "./Routes/taskRoutes.ts";
import customerRouter from "./Routes/customerRoutes.ts";
import dashBoardRouter from "./Routes/dashBoardRoutes.ts";
import dotenv from "dotenv";
import connectDb from "./config/db.ts"
dotenv.config();

const app: Express = express()
app.use(express.json());
app.use(cors());
app.use("/api/v1", authRouter)
app.use("/api/v1", customerRouter);
app.use("/api/v1", dealRouters);
app.use("/api/v1", taskRouters)
app.use("/api/v1", dashBoardRouter);


connectDb()

const port = process.env.PORT  || 3000;
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "server is running"
    })
})


app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})
