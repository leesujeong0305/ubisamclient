import React, { useEffect, useState } from 'react';
import './UserUnitInfo.css';
import { useSelector } from 'react-redux';
import { UpdateUserInfo } from '../../../../API/UpdateUserInfo';

const UserUnitInfo = ({ user }) => {
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
      //const data = await GetTeamProject(site);
      // const projectExists = data.some(item => (item.ProjectName === formValues.Project) && (oldProject !== item.ProjectName));
      // if (projectExists) {
      //   alert('같은 이름을 가진 Project가 있습니다. 다른 이름으로 변경해 주세요');
      //   return;
      // }

    const result = await UpdateUserInfo(formValues, site);

    setFormValues([]);
  };

  useEffect(() => {
    setFormValues(user);
  }, []);

  return (
    <div className="user-profile-info">
      <div className="user-profile-content">
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-name">{user.name || '-'}</div>
        </div>
        <table className="user-details">
          <tbody>
            <tr>
              <td>아이디</td>
              <td>
                <input
                  disabled
                  type="text"
                  name="user_mail"
                  className="user-input-field-disable"
                  value={user.user_mail || '-'}
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
                  className="user-input-field"
                  value={formValues.email ? formValues.email : ''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>부서</td>
              <td>
                <input
                  type="text"
                  name="email"
                  className="user-input-field"
                  value={formValues.team ? formValues.team : ''}
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
                    value={formValues.rank} //Rank.map((rank, index) => (formValues.rank === rank))
                    onChange={handleInputChange}
                  >
                    <option value={0}>Select</option>
                    {Rank.map((rank, index) => (
                      <option key={index} value={rank}>
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
                  name="year_join"
                  className="user-input-field"
                  value={formValues.year_join ? formValues.year_join : ''}
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
                  className="user-input-field"
                  value={formValues.birthday ? formValues.birthday : ''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='button-container'>
        {/* <button className="user-edit-button" onClick={handleEditUser}>수정</button> */}
      </div>
    </div>
  );
};

export default UserUnitInfo;
