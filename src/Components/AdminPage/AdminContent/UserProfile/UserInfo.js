import React, { useState } from 'react';

import './UserInfo.css';
import Modal from '../../../Settings/Modal';
import UserForm from './UserForm';
import { AddUserInfo } from '../../../../API/AddUserInfo';
import { useSelector } from 'react-redux';
import GetUserInfo from '../../../../API/GetUserInfo';

const UserInfo = ({ rows, onRowClick, handleUpdate }) => {
  const { authUserId, authUserName, authUserRank, authUserTeam } = useSelector(state => state.userInfo);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);

  const Continents = [
    { key: '자동화1팀', value: '파주' },
    { key: '시스템사업팀', value: '구미' },
    { key: '장비사업팀', value: '서울' },
    { key: 'ReadOnly', value: '파주' },
  ];

  const selectSite = () => {
    if (authUserTeam === undefined)
      return;
    const found = Continents.find((item) => item.key === authUserTeam);
    return found ? found.value : undefined;
  }

  const handleAddUser = async (user) => {
    //setUsers([...users, user]);
    if (user.id === undefined) {
      alert('ID를 입력해주세요');
      return;
    }
    const site = selectSite();
    const data = await GetUserInfo("All", "All");
        const projectExists = data.some(item => item.id === user.id);
        if (projectExists) {
            alert(`같은 이름을 가진 직원이 있습니다. 다른 이름으로 변경해 주십시오.\n(타 사이트에서 이미 사용 중인 이름도 사용 불가)`);
            return;
        }
      
    if (user.password === undefined) {
      alert('password를 입력해주세요');
      return;
    }

    if (user.password.length < 4) {
      alert('password 최소 길이는 4자리입니다');
      return;
    }
      
    if (user.name === undefined) {
      alert('Name을 입력해주세요');
      return;
    }
      
    if (user.rank === undefined) {
      alert('Rank를 입력해주세요');
      return;
    }
    
    const addUserInfo = await AddUserInfo(user, site);
    setShowModal(false);
    handleUpdate();
  };
  const rowsPerPage = 15;

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        전체 인원 수: {rows.length}
        <button className="add-button" onClick={openModal}>직원 추가</button>
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
              <td>{row.name || ""}</td>
              <td>{row.id || ""}</td>
              <td>{row.department || ""}</td>
              <td>{row.rank || ""}</td>
              <td>{row.join_date || ""}</td>
              <td>{row.Manager ? '관리자' : '유저'}</td>
              {/* <td>{row.Use ? '재직중' : '퇴사'}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="user-pagination">
        <button onClick={() => handleChangePage(page - 1)} disabled={page === 0}>Previous</button>
        <span>{page + 1} of {Math.ceil(rows.length / rowsPerPage)}</span>
        <button onClick={() => handleChangePage(page + 1)} disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}>Next</button>
      </div>
      <Modal show={showModal} onClose={closeModal}>
        <UserForm onSubmit={handleAddUser} />
      </Modal>
    </div>
  );
};

export default UserInfo;