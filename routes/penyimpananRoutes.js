const express = require('express');
const penyimpananRoutes = require('../controller/penyimpananControllers');
const { route } = require('./userRoute');

const router = express.Router();

router.post('/', penyimpananRoutes.createStorage);
router.get('/', penyimpananRoutes.getAllStorage);
router.delete('/:id', penyimpananRoutes.deleteStorage)

module.exports = router;