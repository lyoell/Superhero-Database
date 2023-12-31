import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ComplaintList from '../main components/Complaints';
import AddAdmin from '../main components/AddAdmin';
import DisableAccountForm from '../main components/DisableAccount';
import EnableAccountForm from '../main components/EnableAccount';
import AllReviews from '../main components/AdminReviews';
import AdminReviews from '../main components/AdminReviews';

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

const TextInput = styled.input`
position: relative;
top: 40px;
  width: 20%;
  padding: 10px;
  margin: 8px 0;
  box-sizing: border-box;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
padding: 20px;
  `;

const InputStorage = () => {
  const [privacy, setPrivacyPolicy] = useState('');
  const [aup, setAUP] = useState('');
  const [DCMA, setDCMA] = useState('');


  const storeValues = async () => {
    let newValues = 
    {
        "privacy": privacy,
        "aup": aup,
        "dcma": DCMA
    }
    try {  
        let response = await fetch(`http://${window.location.hostname}:8080/policyrewrite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newValues),
        });
          } catch (error) {
        console.error('Error fetching superhero data:', error);
      }
  };

  return (
    <div>
        <BackButton to='/AuthorizedPage'>
          &larr; Back
        </BackButton>
        <div>
      <TextInput
        type="text"
        id="input1"
        placeholder="Enter privacy policy"
        value={privacy}
        onChange={(e) => setPrivacyPolicy(e.target.value)}
      />

      <TextInput
        type="text"
        id="input2"
        placeholder="Enter AUP"
        value={aup}
        onChange={(e) => setAUP(e.target.value)}
      />

      <TextInput
        type="text"
        id="input2"
        placeholder="Enter DCMA"
        value={DCMA}
        onChange={(e) => setDCMA(e.target.value)}
      />

      <button onClick={storeValues}>Store Values</button>
      </div>
      <Container>
      <ComplaintList/>
      </Container>
        <Container>
        <AddAdmin/>
        </Container>
        <Container>
          <DisableAccountForm/>
        </Container>
        <Container>
          <EnableAccountForm/>
        </Container>
        <Container>
          <AdminReviews/>
        </Container>
        <Container>
       <h3>
        Workflow / Usage of Tools: 
        </h3>
        <p>
          To change the AUP, DCMA and Privacy columns simply enter the new changes
          and submit
        </p>
        <p>
          To change the complaint details info, change the field of a complaint and then click update details. 
        </p>
        <p>
        To disable / enable a user, enter their emails into the corresponding box and click the button.
        </p>
        <p>
          To hide / delete a review, click the respective button
        </p>
        </Container>
    </div>
  );
};

export default InputStorage;