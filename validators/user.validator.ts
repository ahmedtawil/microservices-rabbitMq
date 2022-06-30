import Joi , {ObjectSchema} from 'joi';

const userSchema : ObjectSchema = Joi.object({
    id: Joi.number(),
    name: Joi.string().required(),
    email:Joi.string().required()
});
 
export = {
    userSchema
}