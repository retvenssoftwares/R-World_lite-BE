import admin from 'firebase-admin';
import serviceAccount from './google-service.js';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function sendNotification(title, message, registrationToken) {
    try {
        const payload = {
            notification: {
                title: title,
                body: message
            }
        };

        await admin.messaging().send(registrationToken, payload);
        console.log('Notification sent successfully.');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

export default { sendNotification };
