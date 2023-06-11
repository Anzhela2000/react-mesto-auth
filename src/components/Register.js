
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../auth.js';
import AuthForm from './AuthForm';
import Header from './Header.js';
import InfoTooltip from './InfoTooltip.js';

const Register = () => {

  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  })

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccessfull, setIsSuccessful] = useState(false);
  const [popupMessage, setPopupMessage] = useState('')

  function handleClosePopup() {
    setIsInfoTooltipOpen(false);
  }

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.register(formValue.email, formValue.password).then(() => {
      navigate('/sign-in', { replace: true }
      );
    })
      .catch(err => {
        setIsInfoTooltipOpen(true);
        setIsSuccessful(false);
        setPopupMessage('Что-то пошло не так! Попробуйте еще раз.')
      })
      .finally(
        setIsInfoTooltipOpen(true),
        setIsSuccessful(true),
        setPopupMessage('Вы успешно зарегистрировались!')
      )
  }

  return (
    <>
      <Header enter={"Вход"} />
      <AuthForm handleSubmit={handleSubmit} handleChange={handleChange} formValue={formValue} title={"Регистрация"} buttonTitle={"Зарегистрироваться"} />
      <InfoTooltip isSuccessfull={isSuccessfull} isOpen={isInfoTooltipOpen} onClose={handleClosePopup} title={popupMessage} />
    </>);
}

export default Register;