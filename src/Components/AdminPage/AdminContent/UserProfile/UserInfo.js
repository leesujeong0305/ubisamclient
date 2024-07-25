import React, { useState } from 'react';
import './UserInfo.css';

const UserInfo = ({ rows, onRowClick }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 15;

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
            <th>ID</th>
            <th>부서</th>
            <th>직급</th>
            <th>입사일</th>
            <th>그룹(역할)</th>
            {/* <th>상태</th> */}
          </tr>
        </thead>
        <tbody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <tr key={index} onClick={() => onRowClick(row)}>
              <td>{row.name}</td>
              <td>{row.user_mail}</td>
              <td>{row.team}</td>
              <td>{row.rank}</td>
              <td>{row.year_join}</td>
              <td>{row.Manager ? '관리자' : '유저'}</td>
              {/* <td>{row.Use ? '재직중' : '퇴사'}</td> */}
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