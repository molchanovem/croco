import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import UserMenu from '../components/UserMenu';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import Modal from '../components/Modal';
import './lich.css';

const Lich = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SERVER_URL = 'https://(...).containers.yandexcloud.net';//Вставте ссылку на ваш сервер

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken = jwt_decode(token);
        setUserName(decodedToken.name || 'Пользователь');
      } catch (e) {
        console.error("Ошибка декодирования токена", e);
        navigate('/login');
      }
    }
  }, [navigate]);

  const fetchFiles = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${SERVER_URL}/files`, {
        headers: { "X-JWT-Token": token }
      });
      setFiles(response.data);
    } catch (error) {
      setMessage(
        'Ошибка при загрузке файлов: ' + (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Пожалуйста, выберите файл для загрузки.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file, encodeURIComponent(file.name));

    const token = localStorage.getItem('token');

    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URL}/upload`, formData, {
        headers: {
          "X-JWT-Token": token,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(response.data.message);
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          id: response.data.id,
          file_name: file.name,
          file_path: response.data.url
        }
      ]);
    } catch (error) {
      setMessage(
        'Произошла ошибка при загрузке файла: ' + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (fileId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`${SERVER_URL}/file/${fileId}`, {
        headers: { "X-JWT-Token": token }
      });

      setMessage(response.data.message);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      setMessage(
        'Произошла ошибка при удалении файла: ' + (error.response?.data?.message || error.message)
      );
    }
  };

  const closeModal = () => {
    setMessage('');
  };

  return (
    <div className="container">
      <UserMenu userName={userName} />
      {message && <Modal message={message} onClose={closeModal} />}
      <div className="file">
        <FileUpload handleFileUpload={handleFileUpload} handleFileChange={handleFileChange} />
        <FileList files={files} handleFileDelete={handleFileDelete} />
      </div>
    </div>
  );
};

export default Lich;
