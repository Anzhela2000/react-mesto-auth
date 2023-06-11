import Header from "./Header";
import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from '../auth.js';
import AuthForm from "./AuthForm";
import InfoTooltip from "./InfoTooltip";

function Login({ handleLogin }) {

  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  function handleClosePopup() {
    setIsInfoTooltipOpen(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValue.email || !formValue.password) {
      setErrorMessage('Both fields are required');
      return;
    }

    const { email, password } = formValue;

    auth.authorize(email, password)
      .then(data => {
        if (data) {
          localStorage.setItem('jwt', data.token);
          handleLogin(formValue.email);
          navigate("/", {
            replace: true
          });
        }
      })
      .catch(error => {
        console.log(error)
        setIsInfoTooltipOpen(true)
      })
  }

  return (
    <>
      <Header enter={"Регистрация"} />
      <AuthForm handleSubmit={handleSubmit} handleChange={handleChange} formValue={formValue} title={"Вход"} buttonTitle={"Войти"} />
      <InfoTooltip isSuccessfull={false} isOpen={isInfoTooltipOpen} onClose={handleClosePopup} title={'Что-то пошло не так! Попробуйте еще раз.'} />
    </>
  );
}

export default Login;