import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  `;

const ComplaintDetails = ({ complaint }) => {
  const [formValues, setFormValues] = useState({
    "id":"",
    "notice": "",
    "dispute": "",
    "status": "",
  });

  useEffect(() => {
    // Set initial form values based on complaint data
    setFormValues({
     "id": complaint.requestID,
      "notice": complaint.dateNoticeSent || "",
      "dispute": complaint.dateDisputeReceived || "",
      "status": complaint.status || "",
    });
  }, [complaint]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost:8080/dcmacomplaintadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      // Handle the response if needed

    } catch (error) {
      console.error('Error updating complaint details:', error);
    }
  };

  return (
    <Container>
      <h3>Complaint Details</h3>
      <p>ID: {complaint.requestID}</p>
      <p>Date Request Received: {complaint.dateRequestReceived}</p>
      <p>Notes: {complaint.notes || "N/A"}</p>

      <label>
        Date Notice Sent:
        <input
          type="date"
          name="notice"
          value={formValues.notice}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Date Dispute Received:
        <input
          type="date"
          name="dispute"
          value={formValues.dispute}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Status:
        <input
          type="text"
          name="status"
          value={formValues.status}
          onChange={handleInputChange}
        />
      </label>

      <button onClick={handleUpdate}>Update Details</button>
    </Container>
  );
};

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/dcmacomplaintall');
        const complaintsData = await response.json();
        setComplaints(complaintsData);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Complaints List</h1>
      {complaints.map((complaint) => (
        <ComplaintDetails key={complaint.requestID} complaint={complaint} />
      ))}
    </div>
  );
};

export default ComplaintList;
