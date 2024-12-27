const NotificationService = require ('../service/notificationService')

const sendFirebaseNotication = async (req, res) => {
    try {
        const { title, body, deviceToken } = req.body;

        NotificationService.sendNotification(deviceToken, title, body);
        res.status(200).json({
            message: 'notification success', sucess: true
        })
    } catch (error) {
        res.status(500).json({
            message: 'error sending notification', sucess: false
        })
    }
}

module.exports = sendFirebaseNotication;