const Joi = require("joi")
const {AppError} = require("../AppError")

const accommodationSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(10),
    image: Joi.string().required(),
    location:  Joi.string().required(),
    description:Joi.string().required()
}) 

function validateForm(req, res, next) {
    const accommodationSchema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(10),
        image: Joi.string().required(),
        location:  Joi.string().required(),
        description:Joi.string().required()
    }) 

    const {error} = accommodationSchema.validate(req.body)

        // console.log(error)
        if (error) {
            throw new AppError(502, error.message)
        } else {
            next()
        }

}

module.exports = {validateForm}