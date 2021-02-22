import React, { useState, FormEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { UserInfo } from "../../Services/userService";
import { createUser, createEmailAndUserNameForUser } from "../../Services/userService";
import { ChangeLanguage } from '../ChangeLanguage/ChangeLanguage';

interface FormItems {
  userName: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const { t } = useTranslation();
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
      <ChangeLanguage />
      <h1>{t('signUp.signUp')}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="userName" placeholder={t('signUp.enterUserName')} onChange={handleChange} /><br /><br />
        <input type="text" name="email" placeholder={t('login.enterEmail')} onChange={handleChange} /><br /><br />
        <input type="password" name="password" placeholder={t('login.enterPassword')} onChange={handleChange} /><br /><br />
        <button type="submit">{t('signUp.signUp')}</button>
        <p>{t('signUp.alreadyHaveAccount')}</p>
        <button onClick={handleClick}>{t('login.login')}</button>
      </form>
    </div>
  );
}
