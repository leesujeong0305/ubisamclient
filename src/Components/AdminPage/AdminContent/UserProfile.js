import React, { useState } from 'react';
import UserInfo from './UserInfo';
import UserUnitInfo from './UserUnitInfo';
import './UserProfile.css';

const createData = (name, email, password, rank, yearOfJoining) => {
  return { name, email, password: '****', rank, yearOfJoining };
};

const rows = [
  createData('Jon Snow', 'jon@example.com', '****', 'Lord Commander', 2012),
  createData('Cersei Lannister', 'cersei@example.com', '****', 'Queen', 2010),
  createData('Jaime Lannister', 'jaime@example.com', '****', 'Commander', 2011),
  createData('Arya Stark', 'arya@example.com', '****', 'Assassin', 2013),
  createData('Daenerys Targaryen', 'daenerys@example.com', '****', 'Queen', 2011),
  createData('Tyrion Lannister', 'tyrion@example.com', '****', 'Hand of the Queen', 2010),
  createData('Sansa Stark', 'sansa@example.com', '****', 'Lady of Winterfell', 2012),
  createData('Bran Stark', 'bran@example.com', '****', 'Three-Eyed Raven', 2013),
  createData('Samwell Tarly', 'samwell@example.com', '****', 'Maester', 2012),
  createData('Brienne of Tarth', 'brienne@example.com', '****', 'Knight', 2011),
  createData('Sandor Clegane', 'sandor@example.com', '****', 'Hound', 2010),
  createData('Jorah Mormont', 'jorah@example.com', '****', 'Knight', 2009),
  createData('Theon Greyjoy', 'theon@example.com', '****', 'Prince', 2010),
  createData('Ygritte', 'ygritte@example.com', '****', 'Wildling', 2012),
  createData('Melisandre', 'melisandre@example.com', '****', 'Priestess', 2008)
];

const UserProfile = () => {
  const [selectedUser, setSelectedUser] = useState(rows[0]);

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="user-profile-container">
      <div className="user-info-section">
        <UserInfo rows={rows} onRowClick={handleRowClick} />
        <div className="user-unit-info-section">
          <UserUnitInfo user={selectedUser || {}} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;