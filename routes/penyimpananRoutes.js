const express = require('express');
const penyimpananControllers = require('../controller/penyimpananControllers');
const validateCreateStorage = require ('../middleware/validate')

const router = express.Router();

router.post('/', penyimpananControllers.createStorage, validateCreateStorage);
router.get('/', penyimpananControllers.getAllStorage);
router.get('/:id', penyimpananControllers.getStorageById);
router.get('/by-category', penyimpananControllers.getStorageByCategory);
router.delete('/:id', penyimpananControllers.deleteStorage);

module.exports = router;