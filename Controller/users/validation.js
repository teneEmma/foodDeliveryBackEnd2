import Joi from "joi";

export function validateLogin(userToValidate){

    const joiSchema = Joi.object({
        username: Joi.string().min(4).max(15).required(),
        email: Joi.string().email({minDomainSegments: 2}).trim(true).required(),
        password: Joi.string().trim(true),
        phoneNumber: Joi.string().length(12),
        userType: Joi.string().valid("ADMIN", "CLIENT")
    });

    return joiSchema.validate(userToValidate);
}