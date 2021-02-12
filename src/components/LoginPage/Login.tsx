import React, { useState, FormEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { signInUser } from "../../Services/userService";
import { ChangeLanguage } from '../ChangeLanguage/ChangeLanguage';

interface UserData {
  email: string;
  password: string;
}

export const Login = () => {
  const { t } = useTranslation();
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
      <ChangeLanguage />
      <h1>{t('login.login')}</h1>
      <form onSubmit={handleLogin}>
        <input type="text" name="email" value={values.email} placeholder={t('login.enterEmail')} onChange={handleChange} /><br /><br />
        <input type="password" name="password" value={values.password} placeholder={t('login.enterPassword')} onChange={handleChange} /><br /><br />
        <button>{t('login.login')}</button>
        <p>{t('login.notRegisteredYet')}</p>
        <button onClick={handleSignUp}>{t('login.signUp')}</button>
      </form>
    </div>
  );
}
