class CustomError extends Error{
    constructor(message, status){
        super(message);
        this.name="Custom Error";
        Error.captureStackTrace(this, this.constructor);
        this.status=status;
        this.message=message;
    }
}

export default CustomError;