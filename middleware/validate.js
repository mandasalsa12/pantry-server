const Joi = require('joi');

// Schema validasi menggunakan Joi
const storageSchema = Joi.object({
    name: Joi.string().required(),
    categoryId: Joi.number().integer().optional(), // Menggunakan categoryId, boleh null
    activity: Joi.string().required(),
    activityDate: Joi.date().required(),
    expiryDate: Joi.date().required(),
    quantity: Joi.number().integer().min(1).required(),
    storageLocation: Joi.string().required(),
});

// Helper untuk validasi input
const validateInput = (data, schema) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(error.details.map(err => err.message).join(', '));
    }
    return value;
};

module.exports = {
    storageSchema,
    validateInput
};
