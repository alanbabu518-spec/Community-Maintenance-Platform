import express from "express";
import cors from "cors";
import userRoutes from "./modules/users/user.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users",userRoutes);

app.get("/api/health",(req,res)=>{
    res.json({
        status: "ok",
    })
})

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on Port:${PORT}`);
    
})
