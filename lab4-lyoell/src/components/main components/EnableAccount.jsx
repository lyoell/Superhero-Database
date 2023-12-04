import React, { useState } from 'react';

const EnableAccountForm = () => {
  const [email, setEmail] = useState('');

  const handleEnableAccount = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8080/reactivateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log(`User account with email ${email} enabled successfully`);
      } else {
        console.error('Error enabling user account:', response.statusText);
      }
    } catch (error) {
      console.error('Error enabling user account:', error.message);
    }

    setEmail('');
  };

  return (
    <div>
      <h2>Enable User Account</h2>
      <label htmlFor="email">User Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleEnableAccount}>Enable Account</button>
    </div>
  );
};

export default EnableAccountForm;
