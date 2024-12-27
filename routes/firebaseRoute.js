const express = require('express');
const sendFirebaseNotification = require('../controller/firebaseControllers');

const router = express.Router();

router.post("/send-notification", async (req, res) => {
    const result = await sendFirebaseNotification(req, res);
    return res.send(result);
})

module.exports = router;