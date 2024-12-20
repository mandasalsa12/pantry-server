const { body } = require('express-validator');

const validateCreateStorage = [
    body('name').notEmpty().withMessage('Name is required'),
    body('activity').notEmpty().withMessage('Activity is required'),
    body('activityDate').isISO8601().withMessage('Activity date must be a valid date'),
    body('expiryDate').isISO8601().withMessage('Expiry date must be a valid date'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    body('storageLocation').notEmpty().withMessage('Storage is required')
]

module.exports = validateCreateStorage