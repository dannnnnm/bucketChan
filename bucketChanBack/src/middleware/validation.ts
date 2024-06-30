import Joi from "joi"


export function validate(validator:Joi.ObjectSchema<any>,subObject:string=null){
    return (req,res,next)=>{
        let evaluated=subObject!=null?req.body[subObject]:req.body
        let {error}=validator.validate(evaluated)
        if (error){
            res.status(200).send(error);
        }
        else{
            next()
        }

    }

}