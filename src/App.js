import React, { useState } from "react";
import firebase from "./utils/firebase";
import "firebase/auth";

import { ToastContainer } from "react-toastify";

import Auth from "./Pages/Auth";
import LoggedLayout from "./Layouts/LoggedLayout/LoggedLayout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadApp, setReloadApp] = useState(false);

  firebase.auth().onAuthStateChanged((currentUser) => {
    if (!currentUser?.emailVerified) {
      firebase.auth().signOut();
      setUser(null);
    } else {
      setUser(currentUser);
    }
    setLoading(false);
  });

  return (
    <>
      <div>
        {loading ? null : user ? (
          <LoggedLayout user={user} setReloadApp={setReloadApp} />
        ) : (
          <Auth />
        )}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibility
        draggable
        pauseOnHover={false}
      />
    </>
  );
}

export default App;
