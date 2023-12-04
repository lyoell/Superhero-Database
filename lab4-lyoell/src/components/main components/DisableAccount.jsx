import React, { useState } from 'react';

const DisableAccountForm = () => {
  const [email, setEmail] = useState('');

  const handleDisableAccount = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8080/deactivateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log(`User account with email ${email} disabled successfully`);
      } else {
        console.error('Error disabling user account:', response.statusText);
      }
    } catch (error) {
      console.error('Error disabling user account:', error.message);
    }

    setEmail('');
  };

  return (
    <div>
      <h2>Disable User Account</h2>
      <label htmlFor="email">User Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleDisableAccount}>Disable Account</button>
    </div>
  );
};

export default DisableAccountForm;
