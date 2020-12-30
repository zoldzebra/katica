import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { AuthContext } from "../AuthProvider/AuthProvider";

interface FormItems {
  username: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const authContext = useContext(AuthContext);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  } as FormItems);

  const history = useHistory();
  const handleClick = () => {
    history.push("/auth/login")
  }

  const handleChange = (event: any) => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  }

  const handleSubmit = (event: any) => {
    event?.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential: firebase.auth.UserCredential) => {
        authContext.setUser(userCredential);
        const db = firebase.firestore();
        db.collection("Users")
          .doc(userCredential.user!.uid)
          .set({
            email: values.email,
            username: values.username,
          })
          .then(() => {
            console.log('ok');
            history.push("/lobby");
          })
          .catch(error => {
            console.log(error.message);
            alert(error.message);
          });
      })
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} /><br /><br />
        <input type="text" name="email" placeholder="Enter your Email" onChange={handleChange} /><br /><br />
        <input type="password" name="password" placeholder="Enter your Password" onChange={handleChange} /><br /><br />
        <button type="submit">Sign Up</button>
        <p>Already have account?</p>
        <button onClick={handleClick}>Login</button>
      </form>
    </div>
  );
}
