import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import VideoBackgroundHacker from "../media/VideoBackGroundHacker";

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  color: black;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  background-color: white;
`;

const PrivacyContainer = styled.div`
  width: 80%;
  margin: 50px auto 0;
`;

const PrivacyParagraph = styled.p`
  color: white;
  font-family: 'Garamond, serif';
  margin-bottom: 20px;
  background-color: black;
  padding: 70px;
`;

const ComplaintForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default function InfoPage() {
  const [data, setData] = useState({});
  const [complaint, setComplaint] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://${window.location.hostname}:8080/policy`);
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const allPrevious = await fetch(`http://${window.location.hostname}:8080/dcmacomplaint`);
      let numberComplaints = await allPrevious.json();
  
      let newValues = {
        "id": numberComplaints.length,
        "date": new Date(),
        "note": complaint
      };
  
      const response = await fetch(`http://${window.location.hostname}:8080/dcmacomplaint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newValues),
      });
      setComplaint("");

  
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };
  

  return (
    <div>
      <VideoBackgroundHacker />
      <PrivacyContainer>
        <BackButton to='/DefaultPage'>
          &larr; Back
        </BackButton>
        <PrivacyParagraph>
          <strong>Security & Privacy:</strong> {data.privacy}
        </PrivacyParagraph>
        <PrivacyParagraph>
          <strong>Acceptable Use Policy (AUP):</strong> {data.aup}
        </PrivacyParagraph>
        <PrivacyParagraph>
          <strong>DCMA Notice and Takedown Policy:</strong> {data.dcma}
        </PrivacyParagraph>
        <ComplaintForm onSubmit={handleSubmit}>
          <TextArea
            placeholder="Type your complaint here..."
            value={complaint}
            onChange={handleComplaintChange}
          />
          <SubmitButton type="submit">Submit Complaint</SubmitButton>
        </ComplaintForm>
      </PrivacyContainer>
    </div>
  );
}
