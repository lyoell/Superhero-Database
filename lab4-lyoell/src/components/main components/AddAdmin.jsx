import React, { useState } from 'react';

const AddAdmin = () => {
  const [adminName, setAdminName] = useState('');

  const handleInputChange = (e) => {
    setAdminName(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:8080/admin/${adminName}`, {
        method: 'POST'
      });

      if (response.ok) {
        console.log('Admin added successfully');
        // Optionally, you can perform additional actions after a successful request
      } else {
        console.error('Failed to add admin');
        // Handle the case where the request was not successful
      }

    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  return (
    <div>
      <label>
        Add Admin:
        <input
          type="text"
          value={adminName}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AddAdmin;
