import joi from 'joi'

export const cardSchema = joi.object({
    cardName: joi.string().required(),
    cardNumber: joi.number().required(),
    securityNumber: joi.string().required(),
    expirationDate: joi.string().required()
})