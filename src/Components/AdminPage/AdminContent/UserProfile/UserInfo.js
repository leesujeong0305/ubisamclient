import React, { useState } from 'react';
import './UserInfo.css';

const UserInfo = ({ rows, onRowClick }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 7;

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        전체 인원 수: {rows.length}
        <button className="add-button">회원 추가</button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th className="edit-header">Edit</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <tr key={index} onClick={() => onRowClick(row)}>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.password}</td>
              <td>
                <i className="fas fa-edit edit-icon"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handleChangePage(page - 1)} disabled={page === 0}>Previous</button>
        <span>{page + 1} of {Math.ceil(rows.length / rowsPerPage)}</span>
        <button onClick={() => handleChangePage(page + 1)} disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}>Next</button>
      </div>
    </div>
  );
};

export default UserInfo;