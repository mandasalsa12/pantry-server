const express = require ('express');
const userController = require ('../controller/userControllers')

const router = express.Router();

router.post('/', userController.createUser);
router.post('/login', userController.loginUser)
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router