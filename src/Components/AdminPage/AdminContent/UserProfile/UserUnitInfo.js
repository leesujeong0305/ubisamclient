import React, { useEffect, useState } from 'react';
import './UserUnitInfo.css';
import { useSelector } from 'react-redux';
import { UpdateUserInfo } from '../../../../API/UpdateUserInfo';

const UserUnitInfo = ({ user, handleUpdate }) => {
  const Rank = ["상무", "팀장", "부장", "차장", "과장", "대리", "사원"];
  const Continents = [
    { key: '자동화1팀', value: '파주' },
    { key: '시스템사업팀', value: '구미' },
    { key: '장비사업팀', value: '서울' },
    { key: 'ReadOnly', value: '파주' },
  ];
  const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector((state) => state.userInfo);

  const [formValues, setFormValues] = useState([]);

  const selectSite = () => {
    if (authUserTeam === undefined) return;
    const found = Continents.find((item) => item.key === authUserTeam);
    return found ? found.value : undefined;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditUser = async () => {
    if (!window.confirm('수정시겠습니까?')) {
      // 사용자가 Cancel을 클릭한 경우
      //console.log('프로젝트 수정이 취소되었습니다.');
      return;
    }

    const site = selectSite();
    const result = await UpdateUserInfo(formValues, site);

    handleUpdate();
  };

  useEffect(() => {
    setFormValues(user);
  }, [user]);

  return (
    <div className="user-profile-info">
      <div className="user-profile-content">
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-name">{user.name || ''}</div>
        </div>
        <table className="user-details">
          <tbody>
            <tr>
              <td className='details-item'>아이디</td>
              <td className='d-flex'>
                <input
                  disabled
                  type="text"
                  name="id"
                  className="user-input-field-disable"
                  value={user.id || ''}
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td>{'****'}</td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>
                <input
                  type="text"
                  name="email"
                  className="user-input-field user-input-field-width"
                  value={formValues.email || ''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>부서</td>
              <td>
                <input
                  type="text"
                  name="department"
                  className="user-input-field user-input-field-width"
                  value={formValues.department || ''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>직급</td>
              <td>
                <div className='user-dropdown'>
                  <select
                    name="rank"
                    className="user-input-field"
                    value={formValues.rank}
                    onChange={handleInputChange}
                  >
                    <option key={0} value={0}>Select</option>
                    {Rank.map((rank, index) => (
                      <option key={index + 1} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td>입사일</td>
              <td>
                <input
                  type="text"
                  name="join_date"
                  className="user-input-field user-input-field-width"
                  value={formValues.join_date || ''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>생일</td>
              <td>
              <input
                  type="text"
                  name="birthday"
                  className="user-input-field user-input-field-width"
                  value={formValues.birthday ||''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='button-container'>
        <button className="user-edit-button" onClick={handleEditUser}>수정</button>
      </div>
    </div>
  );
};

export default UserUnitInfo;
