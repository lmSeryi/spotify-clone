import firebaseApp from "./firebase";
import * as firebase from "firebase";

const db = firebase.firestore(firebaseApp);

export const isUserAdmin = async (uid) => {
  const doc = await db.collection("Admins").doc(uid).get();
  return doc.exists;
};

export const reauthenticate = async (password) => {
  const user = firebase.auth().currentUser;

  const credentials = await firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );

  return user.reauthenticateWithCredential(credentials);
};
