
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../auth.js';
import AuthForm from './AuthForm';
import Header from './Header.js';
import InfoTooltip from './InfoTooltip.js';

const Register = ({ handleToolPopup }) => {

  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  })

  const [errorInfoTooltipTitle, setErrorInfoTooltipTitle] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

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
      navigate('/sign-in', { replace: true });
    })
    .catch(err => {
      setIsInfoTooltipOpen(true);
    })
  }

  return (
    <>
      <Header enter={"Вход"} />
      <AuthForm handleSubmit={handleSubmit} handleChange={handleChange} formValue={formValue} title={"Регистрация"} buttonTitle={"Зарегистрироваться"} />
      <InfoTooltip isSuccessfull={false} isOpen={isInfoTooltipOpen} onClose={handleClosePopup} title={'Что-то пошло не так! Попробуйте еще раз'}/>
    </>);
}

export default Register;