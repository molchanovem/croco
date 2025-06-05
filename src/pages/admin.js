import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import UserMenu from '../components/UserMenu';
import './admin.css';

const API_BASE_URL = "https://(...).containers.yandexcloud.net";//Вставте ссылку на ваш сервер

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.warn("Нет токена для запроса пользователей");
      setToken(null);
      return;
    }

    setToken(storedToken);

    try {
      const decoded = jwt_decode(storedToken);
      setUserName(decoded.name || 'Пользователь');
    } catch (e) {
      console.error("Ошибка при декодировании токена", e);
      setUserName('Пользователь');
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        setError(null);
        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: { 'X-JWT-Token': token },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
        setError("Ошибка при загрузке пользователей.");
      }
    };

    fetchUsers();
  }, [token]);

  const deleteUser = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить пользователя?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { 'X-JWT-Token': token },
      });
      setUsers(prev => prev.filter(user => user.id !== id));
      alert("Пользователь успешно удалён.");
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      alert("Не удалось удалить пользователя.");
    }
  };

  const resetPassword = async (id) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/admin/users/${id}/reset-password`, {}, {
        headers: { 'X-JWT-Token': token },
      });
      alert(`Новый пароль: ${res.data.newPassword}`);
    } catch (error) {
      console.error("Ошибка при сбросе пароля:", error);
      alert("Не удалось сбросить пароль.");
    }
  };

  if (!token) {
    return <p>Требуется авторизация для просмотра панели администратора.</p>;
  }

  return (
    <div className="admin-panel">
      <UserMenu userName={userName} />
      <div className="table-container">
        <h1>Пользователи</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {users.length === 0 && !error ? (
          <p>Пользователи не найдены.</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <button type="button" onClick={() => deleteUser(user.id)}>Удалить</button>{" "}
                    <button type="button" onClick={() => resetPassword(user.id)}>Сброс пароля</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
