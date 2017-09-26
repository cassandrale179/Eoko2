const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendNotification = functions.database.ref('/nudge/{userId}/{otherId}/')
    .onWrite(event => {
        const nudge = event.data.current.val();
        const senderUid = nudge.senderUid;
        const receiverUid = nudge.receiverUid;
        const promises = [];

        // if (senderUid == receiverUid) {
        //     //if sender is receiver, don't send notification
        //     promises.push(event.data.current.ref.remove());
        //     return Promise.all(promises);
        // }

        const getInstanceIdPromise = admin.database().ref(`/users/${receiverUid}/`).once('value');
        const getReceiverUidPromise = admin.auth().getUser(receiverUid);
        const getSenderUidPromise = admin.auth().getUser(senderUid);

        return Promise.all([getInstanceIdPromise, getReceiverUidPromise, getSenderUidPromise]).then(results => {
          console.log("results", results);
            const instanceId = results[0].val().messageToken;
            const receiver = results[1];
            const sender = results[2];
            console.log("receiver uid: ", receiver);
            console.log("message token: ", instanceId);
            console.log('notifying ' + receiverUid + ' about nudge' + ' from ' + senderUid);
            var body = sender.displayName + " just nudged you!";

            const payload = {
                notification: {
                    title: "You have an Eoko nudge!",
                    body: body,
                    icon: sender.photoURL
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });
        });
    });

//
//
//
// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// // exports.helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });
//
// // The Firebase Admin SDK to access the Firebase Realtime Database.



//
// // Retrieve Firebase Messaging object.
// const messaging = firebase.messaging();
// messaging.requestPermission()
// .then(function() {
//   console.log('Notification permission granted.');
//   // TODO(developer): Retrieve an Instance ID token for use with FCM.
//   // ...
// })
// .catch(function(err) {
//   console.log('Unable to get permission to notify.', err);
// });
//
// // Get Instance ID token. Initially this makes a network call, once retrieved
//  // subsequent calls to getToken will return from cache.
//  messaging.getToken()
//  .then(function(currentToken) {
//    if (currentToken) {
//      sendTokenToServer(currentToken);
//      updateUIForPushEnabled(currentToken);
//    } else {
//      // Show permission request.
//      console.log('No Instance ID token available. Request permission to generate one.');
//      // Show permission UI.
//      updateUIForPushPermissionRequired();
//      setTokenSentToServer(false);
//    }
//  })
//  .catch(function(err) {
//    console.log('An error occurred while retrieving token. ', err);
//    showToken('Error retrieving Instance ID token. ', err);
//    setTokenSentToServer(false);
//  });
// }
//
// // Callback fired if Instance ID token is updated.
// messaging.onTokenRefresh(function() {
//   messaging.getToken()
//   .then(function(refreshedToken) {
//     console.log('Token refreshed.');
//     // Indicate that the new Instance ID token has not yet been sent to the
//     // app server.
//     setTokenSentToServer(false);
//     // Send Instance ID token to app server.
//     sendTokenToServer(refreshedToken);
//     // ...
//   })
//   .catch(function(err) {
//     console.log('Unable to retrieve refreshed token ', err);
//     showToken('Unable to retrieve refreshed token ', err);
//   });
// });
//
// exports.sendTokenToServer = functions(token) => {
//   // Grab the text parameter.
//
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   admin.database().ref('/users').push({original: original}).then(snapshot => {
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     // res.redirect(303, snapshot.ref);
//   });
// };
//
//
// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// // exports.addMessage = functions.https.onRequest((req, res) => {
// //   // Grab the text parameter.
// //   const original = req.query.text;
// //   // Push the new message into the Realtime Database using the Firebase Admin SDK.
// //   admin.database().ref('/messages').push({original: original}).then(snapshot => {
// //     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
// //     // res.redirect(303, snapshot.ref);
// //   });
// // });
// //
// // // Listens for new messages added to /messages/:pushId/original and creates an
// // // uppercase version of the message to /messages/:pushId/uppercase
// // exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
// //     .onWrite(event => {
// //       // Grab the current value of what was written to the Realtime Database.
// //       const original = event.data.val();
// //       console.log('Uppercasing', event.params.pushId, original);
// //       const uppercase = original.toUpperCase();
// //       // You must return a Promise when performing asynchronous tasks inside a Functions such as
// //       // writing to the Firebase Realtime Database.
// //       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
// //       return event.data.ref.parent.child('uppercase').set(uppercase);
// //     });
