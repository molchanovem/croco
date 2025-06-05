
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import FileConv from '../components/FileConv'; 
import './konv.css'; 

const Konv = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    } else {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Декодируем токен
      setUserName(decodedToken.name); // Устанавливаем имя пользователя
    }
  }, [navigate]);

  return (
    <div className="container">
      <UserMenu userName={userName} /> 
      <div className="content">
        <div className="file-converter">
          <FileConv /> 
        </div>
      </div>
    </div>
  );
};

export default Konv;