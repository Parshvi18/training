const express=require("express");
const cors=require("cors");
const connectDB=require("./config/db");
const authRoutes=require("./router/user")
const errorHandler=require("./middleware/globalerrorHandler")

const app=express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/auth",authRoutes);//is controler ke baad ab koi bhi next call hoega naa to vo errorHandler ke middleware mai jaega ab

app.use(errorHandler);

app.listen(5000,()=>{
    console.log("server is running on 5000")
});


// project mai pehle db connect krte hai fir schema define fir aagey ka kaam
// config db connect,model- schema define,index connects everyone,