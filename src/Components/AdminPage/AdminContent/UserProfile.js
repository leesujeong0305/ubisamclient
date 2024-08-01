import React, { useEffect, useState } from 'react';
import UserInfo from './UserProfile/UserInfo';
import UserUnitInfo from './UserProfile/UserUnitInfo';
import GetUserInfo from '../../../API/GetUserInfo';
import './UserProfile.css'
import { useSelector } from 'react-redux';

// const createData = (name, email, password, rank, yearOfJoining) => {
//   return { name, email, password: '****', rank, yearOfJoining };
// };
// const rows = [
//   createData('Jon Snow', 'jon@example.com', '****', 'Lord Commander', 2012),
//   createData('Cersei Lannister', 'cersei@example.com', '****', 'Queen', 2010),
//   createData('Jaime Lannister', 'jaime@example.com', '****', 'Commander', 2011),
//   createData('Arya Stark', 'arya@example.com', '****', 'Assassin', 2013),
//   createData('Daenerys Targaryen', 'daenerys@example.com', '****', 'Queen', 2011),
//   createData('Tyrion Lannister', 'tyrion@example.com', '****', 'Hand of the Queen', 2010),
//   createData('Sansa Stark', 'sansa@example.com', '****', 'Lady of Winterfell', 2012),
//   createData('Bran Stark', 'bran@example.com', '****', 'Three-Eyed Raven', 2013),
//   createData('Samwell Tarly', 'samwell@example.com', '****', 'Maester', 2012),
//   createData('Brienne of Tarth', 'brienne@example.com', '****', 'Knight', 2011),
//   createData('Sandor Clegane', 'sandor@example.com', '****', 'Hound', 2010),
//   createData('Jorah Mormont', 'jorah@example.com', '****', 'Knight', 2009),
//   createData('Theon Greyjoy', 'theon@example.com', '****', 'Prince', 2010),
//   createData('Ygritte', 'ygritte@example.com', '****', 'Wildling', 2012),
//   createData('Melisandre', 'melisandre@example.com', '****', 'Priestess', 2008)
// ];

const UserProfile = () => {
  const Continents = [
    { key: '자동화1팀', value: '파주' },
    { key: '시스템사업팀', value: '구미' },
    { key: '장비사업팀', value: '서울' },
    { key: 'ReadOnly', value: '파주' },
  ];
  const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector((state) => state.userInfo);
  const [getUsers, setGetUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [show, setshow] = useState(false);

  const selectSite = () => {
    if (authUserTeam === undefined) return;
    const found = Continents.find((item) => item.key === authUserTeam);
    return found ? found.value : undefined;
  };
  

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setshow(true);
  };

  useEffect(() => {
    const LoadUsersInfo = async () => {
      const site = selectSite();
      const users = await GetUserInfo('All', site);
      setGetUsers(users);
    }

    LoadUsersInfo();
  }, [])

  return (
    <div className="user-profile-container">
      <div className="user-info-section">
        <UserInfo rows={getUsers} onRowClick={handleRowClick} />
        {
          show && (
            <div className="user-unit-info-section">
              <UserUnitInfo user={selectedUser || {}} />
            </div>
          )}
      </div>
      
    </div>
  );
};

export default UserProfile;