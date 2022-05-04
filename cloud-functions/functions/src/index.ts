/* eslint-disable */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
// const config = functions.config();

exports.deletingaUser = functions.auth.user().onDelete((user) => {
    return userDeleted(user);
})

async function userDeleted(user: admin.auth.UserRecord) {
    const uid = user.uid;
    console.log("Deleting User: " + uid);
    const firestore = admin.firestore();
    try {
        await firestore.collection('users').doc(uid).delete();
        await firestore.collection('surveys').doc(uid).delete();
        await firestore.collection('favorites').doc(uid).delete();
        console.log("Deleted User: " + uid);
    } catch (error) {
        console.error(error);
    }
}


/* eslint-disable */