import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './avt.css';

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Попытка авторизации с данными:", { name, password });

    try {
      console.log("Отправка запроса на сервер...");
      const res = await axios.post(
        "https://(...).containers.yandexcloud.net/login",//Вставте ссылку на ваш сервер
        { name, password }
      );

      console.log("Ответ от сервера:", res);

      const token = res.data.token;
      localStorage.setItem("token", token);
      console.log("Токен успешно сохранен в localStorage:", token);

      // Декодируем токен и извлекаем роль
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      console.log("Роль пользователя:", role);
      localStorage.setItem("role", role); 

      alert("Вход успешен!");

      navigate("/lich");

    } catch (error) {
      console.error("Ошибка при входе:", error);
      const errorMessage = error.response?.data?.message || "Ошибка сервера";
      alert("Ошибка входа: " + errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="avtorization">
      <div className="logo" onClick={handleLogout}>
        <img src="/Group 6.png" alt="Logo" className="logo-image" />
      </div>
      <h2>Авторизация</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Войти</button>
      </form>

      <p>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
};

export default Login;
