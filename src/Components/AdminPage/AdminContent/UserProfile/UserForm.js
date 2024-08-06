import React, { useState } from 'react';
import './UserForm.css';

const UserForm = ({ onSubmit }) => {
  const Rank = ["상무", "팀장", "부장", "차장", "과장", "대리", "사원"];

  const [formValues, setFormValues] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <div className="user-form" style={{marginTop: '35px'}}>
      <div className="user-info">
        <h4>직원 추가</h4>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            name="id"
            className="user-input-field"
            value={formValues.id || ""}
            onChange={handleInputChange}
            />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formValues.password || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>이름</label>
          <input
            type="name"
            name="name"
            value={formValues.name || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={formValues.email || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>부서</label>
          <input
            type="text"
            name="department"
            value={formValues.department || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>직급</label>
          <select
            name="rank"
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
        <div className="form-group">
          <label>입사일</label>
          <input
            type="text"
            name="join_date"
            value={formValues.join_date || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>생일</label>
          <input
            type="text"
            name="birthday"
            value={formValues.birthday || ""}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button">추가</button>
      </form>
    </div>
  );
};

export default UserForm;