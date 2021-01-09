import React, { useState, FormEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";

import { signInUser } from "../../Services/userService";

interface UserData {
  email: string;
  password: string;
}

export const Login = () => {
  const history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: ""
  } as UserData);

  const handleSignUp = () => {
    history.push("/auth/signup");
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    await signInUser(values.email, values.password);
    history.push("/lobby");
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" name="email" value={values.email} placeholder="Enter your Email" onChange={handleChange} /><br /><br />
        <input type="password" name="password" value={values.password} placeholder="Enter your Password" onChange={handleChange} /><br /><br />
        <button>Login</button>
        <p>Not registered yet?</p>
        <button onClick={handleSignUp}>SignUp</button>
      </form>
    </div>
  );
}
