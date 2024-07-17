// src/components/AdminHeader.js
import React from 'react';
import './AdminHeader.css';

const AdminHeader = ({ title }) => {
  return (
    <div className="header fw-b">
      <h5>{title}</h5>
    </div>
  );
};

export default AdminHeader;