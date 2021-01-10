import React, { useState, FormEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";

import { UserInfo } from "../../Services/userService";
import { createUser, createEmailAndUserNameForUser } from "../../Services/userService";

interface FormItems {
  userName: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const [values, setValues] = useState<FormItems>({
    userName: "",
    email: "",
    password: "",
  });

  const history = useHistory();
  const handleClick = () => {
    history.push("/auth/login")
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const userCredentials = await createUser(values.email, values.password);
    const userInfo = {
      id: userCredentials.user.uid,
      email: userCredentials.user.email,
      userName: values.userName,
    } as UserInfo;
    await createEmailAndUserNameForUser(userInfo);
    history.push("/lobby");
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="userName" placeholder="Username" onChange={handleChange} /><br /><br />
        <input type="text" name="email" placeholder="Enter your Email" onChange={handleChange} /><br /><br />
        <input type="password" name="password" placeholder="Enter your Password" onChange={handleChange} /><br /><br />
        <button type="submit">Sign Up</button>
        <p>Already have account?</p>
        <button onClick={handleClick}>Login</button>
      </form>
    </div>
  );
}
