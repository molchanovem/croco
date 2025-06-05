import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import './reg.css';

const Registration = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); 
  const navigate = useNavigate(); 

  // Функция проверки пароля
  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return "Пароль должен быть не менее 8 символов";
    }
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]*$/.test(pwd)) {
      return "Пароль должен содержать только английские буквы, цифры и спецсимволы";
    }
    if (!/[A-Za-z]/.test(pwd)) {
      return "Пароль должен содержать хотя бы одну букву";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Пароль должен содержать хотя бы одну цифру";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd)) {
      return "Пароль должен содержать хотя бы один спецсимвол";
    }
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    } else {
      setPasswordError("");
    }

    try {
      await axios.post("https://(....).containers.yandexcloud.net/registration", { name, password });//Вставте ссылку на ваш сервер
      alert("Регистрация успешна!");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Ошибка сервера";
      alert("Ошибка регистрации: " + errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="registration">
      <div className="logo" onClick={handleLogout}>
        <img src="/Group 6.png" alt="Logo" className="logo-image" />
      </div>
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Имя" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {passwordError && <p style={{color: "red"}}>{passwordError}</p>}
        <button type="submit">Зарегистрироваться</button>
      </form>

      <p>
        Уже есть аккаунт? <Link to="/login">Авторизация</Link>
      </p>
    </div>
  );
};

export default Registration;
