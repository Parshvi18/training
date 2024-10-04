const errorHandler=(error,req,res,next)=>{
    let statusCode=error.statusCode|| 500;
    let errorMessage=error.errorMessage||"Internal Server error"
    if(error.name==="ValidationError"){
        const errors=Object.values(error.errors).map(error=>error.message);
        statusCode=400;
        errorMessage=errors;
    }
    //baar baar if krke ni likhenge upar statusCode or message update hoke ye neeche wali line mai fed hojaega or fir print hojaega
    res.status(statusCode).send({status:"fail", message:errorMessage})
}

module.exports=errorHandler;


