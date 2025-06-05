import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './knop.css';
import './menu.css';

const UserMenu = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
    } catch (e) {
      console.error("Ошибка разбора токена", e);
    }
  }

  return (
    <div className="menu">
      <h2>{userName || "Пользователь"}</h2>
      <h3>
        <NavLink
          to="/lich"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Файлы
        </NavLink>
        <NavLink
          to="/konv"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Конвертатор
        </NavLink>

        {role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Админ панель
          </NavLink>
        )}
      </h3>

      <button onClick={handleLogout} className="logout-button">
        Выйти
      </button>
    </div>
  );
};

export default UserMenu;
