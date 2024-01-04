const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

exports.usersList = functions.https.onCall(async (data, context) => {
  const listUsers = await admin.auth().listUsers();

  const users = listUsers.users.map(mapUser);

  return users;
});

function mapUser(user) {


  const customClaims = user.customClaims || { admin: false };
  const admin = customClaims.admin ? customClaims.admin : false;
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    disabled: user.disabled,
    admin: admin,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}

exports.createUser = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
      emailVerified: false,
      disabled: data.disabled,
    })
    .then(async (userRecord) => {

      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: data.admin })

      return userRecord;
    })
    .catch((error) => {

      console.log('createUser.error',error.errorInfo);

      throw new functions.https.HttpsError(
        "invalid-argument",
        error.errorInfo.message
      );
    });
});

exports.updateUser = functions.https.onCall((data, context) => {

    let payload = {
        email: data.email,
        displayName: data.name,
        disabled: data.disabled,
      }

     if (data.password.length > 0)
     payload.password = data.password

    return admin
      .auth()
      .updateUser(data.uid,payload)
      .then(async (userRecord) => {

        await admin.auth().setCustomUserClaims(data.uid, { admin: data.admin })
  
        return userRecord;
      })
      .catch((error) => {
        console.log('updateUser.error',error.errorInfo);
  
        throw new functions.https.HttpsError(
          "invalid-argument",
          error.errorInfo.message
        );
      });
  });
  
  
exports.deleteUser = functions.https.onCall((data, context) => {


    return admin.auth().deleteUser(data.uid).then(() => {
    
        return true

  }).catch((error) => {

    console.log('deleteUser.error',error.errorInfo);
  
    throw new functions.https.HttpsError(
      "invalid-argument",
      error.errorInfo.message
    );
  });


});
