import * as functions from 'firebase-functions';
import * as moment from 'moment';
import * as admin from 'firebase-admin';
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//item delivered notification
exports.sendConfirmationNotification = functions.database.
    ref(`postedParcels/{parcelId}/delivery/done`).onCreate((snapshot, context) => {
        console.log(snapshot.val());
        const parcelId = context.params.parcelId;
        let userId;
        admin.database().ref(`postedParcels/${parcelId}/details/sellerID`).once('value', function (data) {
            userId = data.val();

            let title = "", body = "";
            title = 'Delivery Confirmation';
            if (snapshot.val() === true) {
                body = 'item has been successfully delivered'
            } else {
                body = 'Item was not been delivered due to certain reason'
            }
            const ref = admin.database().ref(`devices/seller/${userId}/token`);
            return ref.once('value', function (res) {
                const payload = {
                    notification: {
                        title: title,
                        body: body
                    }
                };
                admin.messaging().sendToDevice(res.val(), payload).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error);
        })
    })

exports.sendConfirmationNotification = functions.database.
    ref(`postedParcels/{parcelId}/delivery/done`).onCreate((snapshot, context) => {
        console.log(snapshot.val());
        const parcelId = context.params.parcelId;
        let userId;
        admin.database().ref(`postedParcels/${parcelId}/details/sellerID`).once('value', function (data) {
            userId = data.val();

            let title = "", body = "";
            title = 'Delivery Confirmation';
            if (snapshot.val() === true) {
                body = 'item has been successfully delivered'
            } else {
                body = 'Item was not been delivered due to certain reason'
            }
            const ref = admin.database().ref(`devices/seller/${userId}/token`);
            return ref.once('value', function (res) {
                const payload = {
                    notification: {
                        title: title,
                        body: body
                    }
                };
                admin.messaging().sendToDevice(res.val(), payload).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error)
        })
    })


// exports.scheduledIncremental = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//     return admin.database().ref(`count`).update(1)
// }) 


//error notification
exports.sendErrorNotification = functions.database.
    ref(`postedParcels/{parcelId}/details/status`).onUpdate((snapshot, context) => {
        const parcelId = context.params.parcelId
        let userId;
        admin.database().ref(`postedParcels/${parcelId}/details/sellerID`).once('value', function (data) {
            userId = data.val();

            let title = "", body = "";
            title = 'Parcel Request';
            if (snapshot.after.val() === 'rejected') {
                body = 'Request has been rejected'
            } else if (snapshot.after.val() === 'assigned') {
                body = 'Request has been assigned'
            } else if (snapshot.after.val() === 'undelivered') {
                body = "Item was not been delivered due to certain reason"
            } else {
                body = "Request has been posted again"
            }
            const ref = admin.database().ref(`devices/seller/${userId}/token`);
            return ref.once('value', function (res) {
                const payload = {
                    notification: {
                        title: title,
                        body: body
                    }
                };
                admin.messaging().sendToDevice(res.val(), payload).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error);
        })
    })

// exports.dateHttp = functions.https.onCall((Request, response => {

// })
exports.date = functions.region('asia-east2').https.onRequest((req, res) => {
    const dateNow = moment();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        res.send(dateNow);
    }
});

