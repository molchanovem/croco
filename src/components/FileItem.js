import React from 'react';
import './file.css';

const getToken = () => localStorage.getItem('token');

const FileItem = ({ file, handleFileDelete }) => {
  const token = getToken();

  const downloadFile = async (fileId) => {
    if (!token) {
      alert("Пожалуйста, войдите в систему для скачивания файла.");
      return;
    }

    try {
      const response = await fetch(`https://(...).containers.yandexcloud.net/file/download/${fileId}`, { //Вставте ссылку на ваш сервер
        method: 'GET',
        headers: {
          'X-JWT-Token': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
      alert("Не удалось скачать файл: " + error.message);
    }
  };

  const openFilePreview = async (fileId) => {
    if (!token) {
      alert("Пожалуйста, войдите в систему для просмотра файла.");
      return;
    }

    try {
      const response = await fetch(`https://(...).containers.yandexcloud.net/file/download/${fileId}`, { //Вставте ссылку на ваш сервер
        method: 'GET',
        headers: {
          'X-JWT-Token': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const isPreviewable = /^image\/|application\/pdf/.test(blob.type);

      if (isPreviewable) {
        window.open(blobUrl, '_blank');
      } else {
        alert("Предпросмотр этого типа файла не поддерживается. Вы можете его скачать.");
      }
    } catch (error) {
      console.error("Ошибка при открытии файла:", error);
      alert("Не удалось открыть файл: " + error.message);
    }
  };

  return (
    <li key={file.id} className="file-item">
      <div className="file-container">
        <span className="file-name">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openFilePreview(file.id);
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.file_name}
          </a>
        </span>
        <div className="file-actions">
          <button
            onClick={() => downloadFile(file.id)}
            className="download-button"
          >
            Скачать
          </button>
          <button
            onClick={() => handleFileDelete(file.id)}
            className="delete-button"
          >
            Удалить
          </button>
        </div>
      </div>
    </li>
  );
};

export default FileItem;
