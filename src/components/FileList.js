
import React, { useState } from 'react';
import FileItem from './FileItem';
import './file.css';

const FileList = ({ files, handleFileDelete }) => {
  const [searchQuery, setSearchQuery] = useState(''); 

  // Фильтруем файлы на основе поискового запроса
  const filteredFiles = files.filter((file) =>
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по файлам"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <h3>Ваши файлы:</h3>
      <ul className="file-list">
        {filteredFiles.length === 0 ? (
          <li className="no-files">Файлы не найдены.</li>
        ) : (
          filteredFiles.map((file) => (
            <FileItem key={file.id} file={file} handleFileDelete={handleFileDelete} />
          ))
        )}
      </ul>
    </div>
  );
};

export default FileList;
