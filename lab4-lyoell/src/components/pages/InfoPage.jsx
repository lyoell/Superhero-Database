import React from 'react';
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
  margin: 50px auto 0; /* Adjust margin-top and overall margin as needed */
`;

const PrivacyParagraph = styled.p`
  color: white;
  font-family: 'Garamond, serif';
  margin-bottom: 20px;
  background-color: black;
  padding: 70px;

`;

export default function InfoPage() {
  return (
    <div>
      <VideoBackgroundHacker/>
      <PrivacyContainer>
      <BackButton to='/DefaultPage'>    
        &larr; Back
      </BackButton>
        <PrivacyParagraph>
          <strong>Security:</strong> Google's Firebase is used to protect the data in our superhero database. Your information is encrypted and stored securely.
        </PrivacyParagraph>
        <PrivacyParagraph>
          <strong>Privacy Policy:</strong> The privacy policy outlines how this app can collect, use, and protect your personal information.
        </PrivacyParagraph>
        <PrivacyParagraph>
          <strong>Acceptable Use Policy (AUP):</strong> Users are expected to use our superhero database responsibly and in compliance with all applicable laws and regulations. The AUP outlines acceptable behavior and content on our platform. Violation of the AUP may result in account suspension or termination.
        </PrivacyParagraph>
        <PrivacyParagraph>
          <strong>DCMA Notice and Takedown Policy:</strong> In compliance with the Digital Millennium Copyright Act (DMCA), there is an established a process for handling copyright infringement notices and takedown requests. If you believe any content on our platform violates copyright, please follow any DCMA notice and takedown procedure.
        </PrivacyParagraph>
      </PrivacyContainer>
    </div>
  );
}
