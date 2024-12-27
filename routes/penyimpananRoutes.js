const express = require('express');
const router = express.Router();
const { createStorage, getStorages, getStorageById, updateStorage, deleteStorage } = require('../controller/penyimpananControllers');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, createStorage);
router.get('/',authMiddleware, getStorages);
router.get('/:id',authMiddleware, getStorageById);
router.put('/:id',authMiddleware, updateStorage);
router.delete('/:id',authMiddleware, deleteStorage);

module.exports = router;
