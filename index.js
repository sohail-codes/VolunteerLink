import express from "express";
import { configDotenv } from "dotenv";
import cors from 'cors';
import router from "./src/routes/index.js";


configDotenv();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const port = process.env.PORT || 3000;

app.use("/api", router)

if (process.env.DEVELOPMENT == "true") {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}



export default { app };