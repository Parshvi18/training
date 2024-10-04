const user=require("../model/user")
const bcrypt=require("bcrypt")

exports.signup=async(req,res,next)=>{
    try{
        const{name,email,password,phoneNumber}=req.body;
        // ab ek check lgaenge ki existing user to nahi hai
        const isExisting= await user.findOne({email:email});
        if(isExisting){
            // res.status(400).send({message:"user already exist"});
            const error=new Error("User Already Exist")
            error.name="ExistingUserError"
            error.statusCode=400;
            throw error;//ab humne yha next isliye use nahi kiya kyuki try catch ki khasiyat hoti hai jaise he hum throw krte hai wese he vo catch mai chla jata hai vha pehle se he next hai to wha se error handler mai chla jaega
        }

        // const hashedPassword=await bcrypt.hash(password,10)//password ke saath aagey comma lga ke salt number daalte hai it means kitni complexity tk encrypt krna chahte ho password jitni high complexity utni zyada CPU needs power to resolve the encryted password generally 10 ya 12 use krte hai

        const newUser= new user({
            name:name,
            email:email,
            password:password,
            phoneNumber:phoneNumber
        })//DB mai data store ho rha hai

        console.log("hello")

        await newUser.save();//DB mai data store ho rha hai
        
        res.status(200).send({message:"Account created"})
    
    }
    catch(error){
        // if(error.name==="ValidationError"){
        //     const errors=Object.values(error.errors).map(error=>error.message);
        //     // ye obj.values objecyt ke ander ki values return krta hai
        //     // yha pr jo validation error ka object hai uski values ko mtlb usme jo msg likhe usko ek array mai dalega fir map uske ek ek element ko acces krke print krdega
        //     return res.status(400).json({message:"Validation Error",error:errors})
        //     //  Cannot set headers after they are sent to the client kbhi bhi ye eeror aaye iska mtlb do response bhj rhe hai jst upar wali line mai maine return ni lgaya to vo ye line read krne je baad if ke baad wala response bhi read kr rha hai return lgane se ye yhi brake hojata
        // }
        // res.status(500).send(error); //in sbko comment krke we will handle error from errorhandler only
        next(error);//yha se ye next kya krega yha se ye index mai jaake humne ek or app.use define kiya hai usme chlega
    }
}

exports.login=async(req,res,next)=>{
    try{
        const{email,password}=req.body;
        const ExistingUser=await user.findOne({email:email});
        if(!ExistingUser){
            // return res.status(404).send({message:"User doesn't Exist"})
            const error=new Error("User doesn't Exist")
            error.statusCode=400;
            throw error;
        };
        const isMatched=password===ExistingUser.password;
        // ab yha login ke tym encrypted password ko match krwane mai prblm aaegi to uske liye hum ye likhte hai👇
        // const isMatched= bcrypt.compare(password,ExistingUser.password)//(frontend wala pass,backend se jo aarhah hai encrypted pass vo) ye dono internally compare hojaenge

        if(!isMatched){
            // return res.status(401).send({message:"Invalid Password"});
            const error=new Error("Invalid Password")
            error.statusCode=400;
            throw error;
        }

        res.status(200).send({message:"user Logged in ",data:ExistingUser})
    }catch(error){
        // res.status(500).send(error);
        next(error);
    }
}
// ab hum direct humare DB pr password store nhi krwa skte becoz jb hum inf backend se frontend pr bhjte hai ya kese bhi access krte hai to there are chnaces ki fishing se data leak ho jaye so 
// we store it in encrypted form in DB 
// for encryption DB mai data store krwane se jst pehle hashing krke usko encrypt krdenge
// ab ye jo encrypted hashedpassword hai isme saari cheezie hoti hai jo humne validation ke tym pr daali hoti hai to ab jb hum new user ka paasword 123 bhi daal de na to vo user create kr dega uske liye hum db mai inf store krwane se pehle kuch krte hai in mongoose middle ware 