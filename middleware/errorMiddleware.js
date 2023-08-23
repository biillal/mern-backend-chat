

const globalError = (err,req,res,next)=>{
    err.statusCode = err.statusCode 
    err.status = err.status
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}


module.exports = globalError