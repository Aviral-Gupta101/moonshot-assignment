import { Express } from "express";
import mongoose from "mongoose";


export function startServer(app: Express, PORT: number) {

    const MONGO_URL = process.env.MONGO_URL;

    if (!MONGO_URL)
        throw new Error("MONGO_URL not defined in env")

    mongoose.connect(MONGO_URL);

    mongoose.connection.once("connected", () => {

        console.log("DB connected");

        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        })

    });
}