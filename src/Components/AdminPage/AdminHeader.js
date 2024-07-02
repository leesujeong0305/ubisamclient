// src/components/AdminHeader.js
import React from 'react';
import './AdminHeader.css';

const AdminHeader = ({ title }) => {
  return (
    <div className="header fw-b" style={{fontSize: '10px'}}>
      <h1>{title}</h1>
    </div>
  );
};

export default AdminHeader;