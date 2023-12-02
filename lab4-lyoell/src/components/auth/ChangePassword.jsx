import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';

const ChangePassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleChangePassword = () => {
    if (authUser) {
      sendPasswordResetEmail(auth, authUser.email)
        .then(() => {
          // Password reset email sent!
          setEmailSent(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // Handle the error appropriately
        });
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {emailSent ? (
        <p>Password reset email sent to {authUser?.email}.</p>
      ) : (
        <button type="button" onClick={handleChangePassword}>
          Change Password
        </button>
      )}
    </div>
  );
};

export default ChangePassword;
