import Joi from "joi"


export function validate(validator:Joi.ObjectSchema<any>,subObject:string=null){
    return (req,res,next)=>{
        console.log("suboj ",req.body[subObject])

        let evaluated=subObject!=null?JSON.parse(req.body[subObject]):req.body
        let {error}=validator.validate(evaluated)
        if (error){
            res.status(400).send(error);
        }
        else{
            next()
        }

    }

}