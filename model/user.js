const mongoose=require("mongoose")
const validator=require("validator") 
const bcrypt=require("bcrypt")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],//yha validation laga diya true ke baad ki jb error jaegi to ye line aajaegi
        minlength:[3,"Name must be 3 charachter long"],
        maxlength:[50,"Name cannot exceed 50 charachter"],
        validate:{
            validator:function(value){
                      
                return validator.isAlpha(value,"en-US",{ignore:" "})
            },
            
            message:"Name should be in String"
        }//name mai isliye validator cz name mai hum numbers bhi daal denge na to error nahi dega cz its also string
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        validate:{//ab jo bhi data bhejenge email mai vo value mai paas hoega
            validator:function(value){
            return validator.isEmail(value);//fir value yha aaegi ye isEmail ek function hai agr value isEMail ke saare function ko satisfy krdega to ye true return krdega nahi to false return kr dega
        },
        message:"please enter valid Email address"//ye tb chlega jb validator false return krdeta hai
        }
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[8,"password must be 8 charachter long"],
        maxlength:[128,"password cannot exceed 128 char"],
        validate:{
            validator:function(value){
               return validator.isStrongPassword(value,{
                minLength:8,//ye object mai jitni condition hai sb satisfy krna chahiye isEmail mai khudke parameters mai define hote hai pr password mai bht cheezien hoti hai to apn apne hissab se daal skte hai
                minLowercase:1,
                minUppercase:1,
                minNumbers:1,
                minSymbols:1
               })
            },
            message:"password must be strong"
        }
    },
    phoneNumber:{
        type:String,
        required:[true,"phone number is required"],
        validate:{
            validator:function(value){
                return validator.isMobilePhone(value,"en-IN")//en-IN indian number ke liye
            },
            message:"please enter a valid phone number"
        }
    }
})

userSchema.pre("save",async function(next){
    const user=this;
    if(!user.isModified("password")) return next();//baar baar update krne pr ye middleware bhi baar baar call hoke password ko hash krega to ek check lga diya ki agr password update ho he ni rha hai to yhi se direct next pr chle jaenge
    const hashedPassword=await bcrypt.hash(user.password,10);
    user.password=hashedPassword;
    next();//yha is next se documents direct svae wale cmnd ko run krne chla jaega
})//ye midleware validation hone ke baad he chlta hai agr validation flse hojaega to ni chlega ye
// userSchema.middleware ka naam("kis pe middleware chalana hai",us middleware ka function).....ab kya hoega jb bhi apna document DB ke ander save hone jaega ye middleware uske jst pehle call hoega...to ab hashed password wala yahi define krdete hai taki validation ke baad vo encrypt ho

// we can also write validations in controller but vo bhut bada code hojata hai ek ek ko validations do
module.exports=mongoose.model("User",userSchema)

// ab ye jo encrypted hashedpassword hai isme saari cheezie hoti hai jo humne validation ke tym pr daali hoti hai to ab jb hum new user ka paasword 123 bhi daal de na to vo user create kr dega uske liye hum db mai inf store krwane se pehle kuch krte hai in mongoose middle ware 
// ab ye mongoose ka middleware lgane ke baad jb hum kbhi update ki query chlaenge to pura data uth ke ata hai uss particular email ka or fir usko hum updatte krke save krte hai na to save se pehle vaps ye wala middleware call hojata hai to waps hashing hoke password encrypt hojata hai to prevent hum ek check lgate hai
// ab mai or jitne elements banati jaugi utne he validations handle krne pdenge to hum ek error handler bna denge sbka ek he jgh error hande hoegi




