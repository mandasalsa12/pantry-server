const express = require('express');
const { createCategory, getCategories, getCategoryById}= require('../controller/categoryController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/', authMiddleware, createCategory);
router.get('/', getCategories)
router.get('/:id', authMiddleware, getCategoryById)
module.exports = router