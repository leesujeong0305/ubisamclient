// src/components/AdminContent.js
import React from 'react';
import './AdminContent.css';

const AdminContent = ({ children }) => {
  return <div className="content">{children}</div>;
};

export default AdminContent;