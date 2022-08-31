const Joi = require("joi");

const userType = ["ADMIN", "CLIENT"];

function createUserValidation(userToValidate){
    const joiSchema = Joi.object({
        username: Joi.string().min(4).max(15).required(),
        email: Joi.string().email({minDomainSegments: 2}).trim(true).required(),
        password: Joi.string().min(6).max(20).trim(true),
        phoneNumber: Joi.string().length(12),
        userType: Joi.string().valid(userType[0], userType[1])
    });

    return joiSchema.validate(userToValidate);
}

function getUserValidation(dataToValidate){
    const joiSchema = Joi.object({
        username: Joi.string().min(4).max(15),
        email: Joi.string().email({ minDomainSegments: 2 }).trim(true)
    });

    return joiSchema.validate(dataToValidate);
}

function authenticateUserValidation(dataToValidate){
    const joiSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).trim(true).required(),
        password: Joi.string().min(6).max(20).trim(true).required()
    });
    
    return joiSchema.validate(dataToValidate);
}

module.exports = {
    createUserValidation, getUserValidation, authenticateUserValidation
};