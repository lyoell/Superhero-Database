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
    if (authUser && authUser.email !== 'liamjohnxuyoell@gmail.com') {
      sendPasswordResetEmail(auth, authUser.email)
        .then(() => {
          setEmailSent(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  };

  return (
    <div>
      {authUser?.email !== 'liamjohnxuyoell@gmail.com' && !emailSent && (
        <button type="button" onClick={handleChangePassword}>
          Change Password
        </button>
      )}
      {emailSent && <p>Password reset email sent to {authUser?.email}.</p>}
    </div>
  );
};

export default ChangePassword;
