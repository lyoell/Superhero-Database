import { signInWithEmailAndPassword, getAuth, AuthErrorCodes } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import styled from 'styled-components';
import VideoBackgroundWorld from "../media/VideoBackgroundWorld";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
`;

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: white;
  font-family: 'Garamond, serif';
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Garamond, serif';
  &:hover {
    background-color: #45a049;
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      navigate("/AuthorizedPage");
    } catch (error) {
      console.log(error);

      if (error.code === AuthErrorCodes.USER_DISABLED) {
        alert('Your account has been disabled. Please contact support.');
      }
      if(error.code === AuthErrorCodes.UNVERIFIED_EMAIL){
        alert('Please verify your email.')
      }
      if(error.code == AuthErrorCodes.INVALID_PASSWORD){
        alert('Invalid Password')
      }
    }
  };

  return (
    <Container>
      <VideoBackgroundWorld/>
      <SignInContainer>
        <BackButton to="/DefaultPage">
          &larr; Back
        </BackButton>
        <SignInForm onSubmit={signIn}>
          <Title>Log In to your Account</Title>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton type="submit">Log In</SubmitButton>
        </SignInForm>
      </SignInContainer>
    </Container>
  );
};

export default SignIn;
