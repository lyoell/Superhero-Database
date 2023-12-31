import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import VideoBackgroundWorld from "../media/VideoBackgroundWorld";
import { useNavigate } from "react-router-dom";

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
`;

const SignUpForm = styled.form`
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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // Redirect when email is verified
        navigate("/DefaultPage");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user profile with the provided username
      await updateProfile(user, {
        displayName: username,
      });

      // Send email verification
      await sendEmailVerification(user);
      alert('Email Verification was sent. Please respond to complete signup. Reload page once complete.');

    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <Container>
      <VideoBackgroundWorld />
      <SignUpContainer>
        <BackButton to="/DefaultPage">
          &larr; Back
        </BackButton>
        <SignUpForm onSubmit={signUp}>
          <Title>Create Account</Title>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton type="submit">Sign Up</SubmitButton>
        </SignUpForm>
      </SignUpContainer>
    </Container>
  );
};

export default SignUp;
