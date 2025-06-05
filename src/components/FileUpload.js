import React, { useState } from 'react';
import './file.css';

const FileUpload = ({ handleFileUpload, handleFileChange }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (handleFileChange) {
      handleFileChange(e); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!file) {
      alert('Пожалуйста, выберите файл для загрузки.');
      return;
    }

    setLoading(true);
    await handleFileUpload(e); 
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="file-upload-wrapper">
        <label htmlFor="file-input" className="file-upload-label">
          {file ? file.name : 'Выберите файл'}
        </label>
        <input
          id="file-input"
          type="file"
          className="file-upload-input"
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" className="btnUpload" disabled={loading}>
        {loading ? 'Загружается...' : 'Загрузить файл'}
      </button>
    </form>
  );
};

export default FileUpload;
