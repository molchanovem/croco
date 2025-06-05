import React, { useState } from 'react';
import axios from 'axios';
import './file.css';
import './conv.css';

const FileConv = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveToFiles, setSaveToFiles] = useState(true);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

    if (file && file.size > maxSizeInBytes) {
      alert('Файл слишком большой. Максимальный размер — 2 МБ.');
      return;
    }

    setUploadedFile(file);
    setConvertedFileUrl(null);
  };

  const handleConvert = async () => {
    if (!uploadedFile) {
      alert('Пожалуйста, выберите файл для преобразования.');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('saveToFiles', saveToFiles);

    try {
      setLoading(true);
      const response = await axios.post(
        'https://(...).containers.yandexcloud.net/convert-office-to-pdf',//Вставте ссылку на ваш сервер
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-JWT-Token': localStorage.getItem('token'),
          },
        }
      );

      setConvertedFileUrl(response.data.url);
      alert('Файл успешно преобразован в PDF!');
    } catch (error) {
      console.error('Ошибка при преобразовании файла в PDF:', error);
      alert('Произошла ошибка при преобразовании файла в PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-converter">
      <h2>Преобразование файлов в PDF</h2>

      <div className="file-upload-wrapper">
        <label className="file-upload-label">
          {uploadedFile ? uploadedFile.name : 'Выбрать файл'}
          <input
            type="file"
            className="file-upload-input"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <button
        className="btnUpload"
        onClick={handleConvert}
        disabled={loading}
      >
        {loading ? 'Преобразование...' : 'Преобразовать в PDF'}
      </button>

      <div className="checkbox-wrapper">
        <label>
          <input
            type="checkbox"
            checked={saveToFiles}
            onChange={(e) => setSaveToFiles(e.target.checked)}
          />
          Сохранить в мои файлы
        </label>
      </div>

      {convertedFileUrl && (
        <div className="download-link">
          <a
            href={convertedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Скачать PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default FileConv;
