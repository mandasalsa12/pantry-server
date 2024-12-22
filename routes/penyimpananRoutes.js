const express = require('express');
const penyimpananControllers = require('../controller/penyimpananControllers');
const validateCreateStorage = require ('../middleware/validate');
const authMiddleware = require ('../middleware/authMiddleware')

const router = express.Router();

router.post('/', penyimpananControllers.createStorage, validateCreateStorage);
router.get('/', penyimpananControllers.getAllStorage);
router.get('/:id', penyimpananControllers.getStorageById);
router.put('/:id',penyimpananControllers.updateStorage)
router.get('/:id/category', penyimpananControllers.getStorageByCategory);
router.delete('/:id', penyimpananControllers.deleteStorage);

module.exports = router;