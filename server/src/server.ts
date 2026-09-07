import express from "express";
import cors from "cors";
import userRoutes from "./modules/users/user.routes.js"
import authRoutes from "./modules/auth/auth.routes.js"
import maintenanceRoutes from "./modules/maintenance/maintenance.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/maintenance",maintenanceRoutes);

app.get("/api/health",(req,res)=>{
    res.json({
        status: "ok",
    })
})

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on Port:${PORT}`);
    
})
