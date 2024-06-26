// src/components/AdminHeader.js
import React from 'react';
import './AdminHeader.css';

const AdminHeader = ({ title }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
    </div>
  );
};

export default AdminHeader;