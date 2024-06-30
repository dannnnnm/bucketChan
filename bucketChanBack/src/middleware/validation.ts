import Joi from "joi"


export function validate(validator:Joi.ObjectSchema<any>){
    return (req,res,next)=>{
        let {error}=validator.validate(req.body)
        if (error){
            res.status(200).send(error);
        }
        else{
            next()
        }

    }

}