import React from 'react';
import './UserUnitInfo.css';

const UserUnitInfo = ({ user }) => {
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
              <td>{user.name || '-'}</td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td>{user.password || '****'}</td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>{user.email || '-'}</td>
            </tr>
            <tr>
              <td>계급</td>
              <td>{user.rank || '-'}</td>
            </tr>
            <tr>
              <td>가입년도</td>
              <td>{user.yearOfJoining || '-'}</td>
            </tr>
            <tr>
              <td>활성화</td>
              <td>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="status" checked={true} readOnly /> 활성
                  </label>
                  <label>
                    <input type="radio" name="status" /> 비활성
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>그룹(역할)</td>
              <td>
                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" checked={true} readOnly /> 관리자
                  </label>
                  <label>
                    <input type="checkbox" /> 사용자
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserUnitInfo;
