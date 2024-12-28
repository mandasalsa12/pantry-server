const express = require('express');
const {createCategory, getCategories}= require('../controller/categoryController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/', authMiddleware, createCategory);
router.get('/', getCategories)

module.exports = router