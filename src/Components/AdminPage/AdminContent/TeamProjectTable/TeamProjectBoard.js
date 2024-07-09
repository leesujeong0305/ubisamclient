import React, { useEffect, useState } from 'react';
import './TeamProjectBoard.css';
import GetUserInfo from '../../../../API/GetUserInfo';
import { useSelector } from 'react-redux';
import { AddTeamProject } from '../../../../API/AddTeamProject';
import GetTeamProject from '../../../../API/GetTeamProject';

const TeamProjectBoard = ({ posts }) => {
  const initialData = [
    {
      ProjectName: '',
      Date: '',
      Status: 0,
      StartMonth: 0,
      EndMonth: 0,
      Users: '',
      ProopsMM: 0,
      Manager: '',
    },
  ];
  const Continents = [
    { key: '자동화1팀', value: '파주' },
    { key: '시스템사업팀', value: '구미' },
  ];

  const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector((state) => state.userInfo);
  const [selectedYear, setSelectedYear] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [projectAdd, setProjectAdd] = useState(false);
  const [projectEdit, setProjectEdit] = useState(false);
  const [selectYear, setSelectYear] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);

  const [formValues, setFormValues] = useState(initialData);

  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let dateString = year + '-' + month + '-' + day;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [initCheckbox, setInitCheckboxes] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);

  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];
  const headers = [
    '순번',
    '프로젝트명',
    '상태',
    '인 원',
    '제안MM',
    ...months,
    '담당자',
    '수정 / 삭제',
  ];
  const states = [
    'Setup',
    'Production Setup',
    'Initiation',
    'Development',
    'Planning',
    'Testing',
  ];

  const selectSite = () => {
    if (authUserTeam === undefined) return;
    const found = Continents.find((item) => item.key === authUserTeam);
    return found ? found.value : undefined;
  };

  const handleCheckboxChange = (id) => {
    setCheckboxes(
      checkboxes.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
  };

  const handleSelectAll = () => {
    const allChecked = checkboxes.every((checkbox) => checkbox.checked);
    setCheckboxes(
      checkboxes.map((checkbox) => ({ ...checkbox, checked: !allChecked }))
    );
  };

  const handleRowClick = (users) => {
    const userList = users.split(', ').map((user) => user.trim());
    setCheckboxes(
      checkboxes.map((checkbox) => ({
        ...checkbox,
        checked: userList.includes(checkbox.label),
      }))
    );
  };

  const calculatePercentage = (startDate, endDate) => {
    
    if (currentMonth > endDate)
      return 100;
    if (startDate > endDate)
      return 100;
    if (startDate === 1) {
      const ratio = currentMonth / endDate;
      let percentage = ratio * 100;
      percentage =percentage - 2; // 몇주차 체크 6: 1주차, 4: 2주차, 2: 3주차 
      return percentage.toFixed(2);
    } else {
      const ratio = currentMonth / (endDate - startDate + 1);
      const percentage = ratio * 100;
      return percentage.toFixed(2);
    }
    
  };

  const handleCreate = () => {
    setProjectAdd(!projectAdd);
    setProjectEdit(false);
    setFormValues(initialData);
    setSelectedRow(null);
  };

  const handleAddRow = async () => {
    const selectedUsers = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label)
      .join(', ');
    if (
      formValues.ProjectName === undefined ||
      formValues.Status === undefined ||
      formValues.StartMonth === undefined ||
      formValues.EndMonth === undefined ||
      selectedUsers === '' ||
      formValues.ProopsMM === undefined ||
      formValues.Manager === undefined
    ) {
      alert('입력하지 않은 항목이 존재합니다.');
    } else {
      const site = selectSite();
      const row = {
        Project: formValues.ProjectName,
        Date: dateString,
        Status: formValues.Status,
        StartMonth: formValues.StartMonth,
        EndMonth: formValues.EndMonth,
        Users: selectedUsers,
        ProopsMM: formValues.ProopsMM,
        Manager: formValues.Manager,
      };

      const result = await AddTeamProject(row, site);

      setFormValues(initialData);
      setProjectAdd(false);
      setShowCheckboxes(false);
      setCheckboxes(initCheckbox);
    }
  };

  const handleEditRow = async () => {
    if (!window.confirm('수정시겠습니까?')) {
      // 사용자가 Cancel을 클릭한 경우
      console.log('프로젝트 수정이 취소되었습니다.');
      return;
    }

    const selectedUsers = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label)
      .join(', ');

    const site = selectSite();
    const row = {
      Project: formValues.ProjectName,
      Date: dateString,
      Status: formValues.Status,
      StartMonth: formValues.StartMonth,
      EndMonth: formValues.EndMonth,
      Users: selectedUsers,
      ProopsMM: formValues.ProopsMM,
      Manager: formValues.Manager,
    };

    const result = await GetTeamProject(row, site);

    setProjectAdd(false);
    setProjectEdit(false);
    setShowCheckboxes(false);
    setCheckboxes(initCheckbox);
  };

  const handleEdit = (row) => {
    console.log('project', row);
    setFormValues(row);
    if (selectedRow === row.index) {
      setProjectEdit(false);
      setSelectedRow(null);
      setShowCheckboxes(false);
    } else {
      setProjectAdd(false);
      setProjectEdit(true);
      setSelectedRow(row.index);
    }
  };

  const handleDelete = (row) => {};

  const groupDataByYear = (data) => {
    return data.reduce((acc, item) => {
      const year = new Date(item.Date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {});
  };

  const handleBeforeYear = () => {
    if (groupData[selectYear - 1] === undefined) {
      alert('데이터가 없습니다');
      return;
    }
    setSelectedYear(groupData[selectYear - 1]);
    setSelectYear(selectYear - 1);
  };

  const handleAfterYear = () => {
    if (groupData[selectYear + 1] === undefined) {
      alert('데이터가 없습니다');
      return;
    }
    setSelectedYear(groupData[selectYear + 1]);
    setSelectYear(selectYear + 1);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // ISO 8601 주 번호를 계산하는 함수
const getISOWeekNumber = (date) => {
  const tempDate = new Date(date);
  const dayNum = tempDate.getUTCDay() || 7; // 일요일(0)을 7로 변환
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum); // 가장 가까운 목요일로 설정
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1)); // 해당 연도의 첫 번째 날
  const weekNumber = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7); // 목요일까지의 전체 주 계산
  return weekNumber;
};

// 두 날짜 간의 ISO 8601 기준 주차 계산 함수
const getWeeksBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 시작 날짜와 종료 날짜의 ISO 8601 주 번호 계산
  const startWeek = getISOWeekNumber(start);
  const endWeek = getISOWeekNumber(end);

  // 연도가 다를 경우의 계산 보정
  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();
  let weeksBetween;

  if (startYear === endYear) {
    weeksBetween = endWeek - startWeek + 1;
  } else {
    const weeksInStartYear = getISOWeekNumber(new Date(Date.UTC(startYear, 11, 31)));
    weeksBetween = (weeksInStartYear - startWeek + 1) + endWeek;
  }

  return weeksBetween;
};

// 주차 수를 계산하는 함수
const getWeeksInMonth = (month) => {
  const year = new Date().getFullYear();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const weeks = [];

  let currentWeek = [];
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    currentWeek.push(new Date(date));
    if (date.getDay() === 6 || date.getDate() === endDate.getDate()) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks.length;
};

  useEffect(() => {
    setSelectYear(currentYear);
    const LoadTeamUsers = async () => {
      const users = await GetUserInfo('All', authUserTeam);
      const initCheckboxes = users.map((val, index) => {
        return { id: index + 1, label: val.name, checked: false };
      });
      setCheckboxes(initCheckboxes);
      setInitCheckboxes(initCheckboxes);
    };
    const filterYear = () => {
      const groupedData = groupDataByYear(posts);
      setGroupData(groupedData);
      console.log('groupedData', groupedData);
      setSelectedYear(groupedData);
      
    };
    LoadTeamUsers();
    console.log('posts', posts);
    filterYear();
  }, [posts]);

  return (
    <div className="project-table-container">
      <div className="Teamtable-counter">
        <div className="year">
          <button className="before-btn" onClick={handleBeforeYear}>
            ◀️
          </button>
          <span>{selectYear}년</span>
          <button className="after-btn" onClick={handleAfterYear}>
            ▶️
          </button>
        </div>
        <div>
          <button className="create-button" onClick={handleCreate}>
            프로젝트 Add
            <i>{projectAdd ? '➖' : '➕'}</i>
          </button>
        </div>
      </div>
      {projectAdd && (
        <div className="input-parrent">
          <div className="input-container" style={{ width: '300px' }}>
            <label className="input-label">Project</label>
            <input
              type="text"
              name="project"
              className="input-field"
              value={formValues.ProjectName}
              onChange={handleInputChange}
              style={{ width: '300px' }}
            />
          </div>
          <div className="input-container dropdown-container">
            <label className={`input-label`}>상태</label>
            <select
              name="status"
              className="input-field"
              value={formValues.Status}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {states.map((state, index) => (
                <option value={index + 1}>{state}</option>
              ))}
            </select>
          </div>

          <div className="input-container users-check">
            <button onClick={() => setShowCheckboxes(!showCheckboxes)}>
              인원 선택
            </button>
          </div>

          <div className="input-container">
            <label className="input-label">제안MM</label>
            <input
              type="text"
              name="proopsMM"
              className="input-field"
              value={formValues.ProopsMM}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>시작</label>
            <select
              name="startMonth"
              className="input-field"
              value={formValues.StartMonth}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>끝</label>
            <select
              name="endMonth"
              className="input-field"
              value={formValues.EndMonth}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label className="input-label">담당자</label>
            <input
              type="text"
              name="manager"
              className="input-field"
              value={formValues.Manager}
              onChange={handleInputChange}
              style={{ width: '140px' }}
            />
          </div>
          <div className="input-container">
            <button
              className="project-button"
              style={{ backgroundColor: '#005FCC' }}
              onClick={handleAddRow}
            >
              ADD
            </button>
          </div>
        </div>
      )}

      {projectEdit && (
        <div className="input-parrent">
          <div className="input-container" style={{ width: '300px' }}>
            <label className="input-label">Project</label>
            <input
              disabled
              type="text"
              name="project"
              className="input-field"
              value={formValues.ProjectName}
              onChange={handleInputChange}
              style={{ width: '300px' }}
            />
          </div>
          <div className="input-container dropdown-container">
            <label className={`input-label`}>상태</label>
            <select
              name="status"
              className="input-field"
              value={formValues.Status}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {states.map((state, index) => (
                <option value={index}>{state}</option>
              ))}
            </select>
          </div>

          <div className="input-container users-check">
            <button onClick={() => setShowCheckboxes(!showCheckboxes)}>
              인원 선택
            </button>
          </div>

          <div className="input-container">
            <label className="input-label">제안MM</label>
            <input
              type="text"
              name="proopsMM"
              className="input-field"
              value={formValues.ProopsMM}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>시작</label>
            <select
              name="startMonth"
              className="input-field"
              value={formValues.StartMonth}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>끝</label>
            <select
              name="endMonth"
              className="input-field"
              value={formValues.EndMonth}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label className="input-label">담당자</label>
            <input
              type="text"
              name="manager"
              className="input-field"
              value={formValues.Manager}
              onChange={handleInputChange}
              style={{ width: '140px' }}
            />
          </div>
          <div className="input-container">
            <button className="project-button" onClick={handleEditRow}>
              EDIT
            </button>
          </div>
        </div>
      )}

      <div className="input-parrent">
        {showCheckboxes && (
          <div>
            <div className="input-container checkbox-container">
              <input
                type="checkbox"
                id="checkbox-all"
                className="input-checkbox"
                onChange={handleSelectAll}
                checked={checkboxes.every((checkbox) => checkbox.checked)}
              />
              <label htmlFor="checkbox-all" className="checkbox-label">
                All
              </label>
            </div>
            {checkboxes.map((checkbox) => (
              <div
                key={checkbox.id}
                className="input-container checkbox-container"
              >
                <input
                  type="checkbox"
                  id={`checkbox-${checkbox.id}`}
                  className="input-checkbox"
                  checked={checkbox.checked}
                  onChange={() => handleCheckboxChange(checkbox.id)}
                />
                <label
                  htmlFor={`checkbox-${checkbox.id}`}
                  className={`checkbox-label ${
                    checkbox.checked ? 'focused' : ''
                  }`}
                >
                  {checkbox.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <table className="Teamproject-table">
        <thead className="Teamproject-head">
          <tr className="Teamproject-table-header">
            {headers.map((header, index) => (
              <th key={index} className="Teamproject-table-header-cell">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(selectedYear && selectYear) && selectedYear[selectYear] &&
            selectedYear[selectYear]?.map((row, index) => (
              <tr key={index} className="Teamproject-table-row">
                <td className="Teamproject-table-cell">{index + 1}</td>
                <td className="Teamproject-table-cell">{row.ProjectName}</td>
                <td className="Teamproject-table-cell">{row.Status}</td>

                <td className="Teamproject-table-cell">{row.Users}</td>
                <td className="Teamproject-table-cell">{`${row.ProopsMM}MM`}</td>
                { row.StartMonth && [...Array(row.StartMonth - 1)].map((_, idx) => (
                  <td key={idx} className="Teamproject-table-cell"></td>
                ))}
                  
                    <td
                   className="Teamproject-table-cell"
                   colSpan={
                     row.StartMonth === 1
                       ? row.EndMonth
                       : row.EndMonth - row.StartMonth + 1
                   }
                 >
                
                  <div className="Teamprogress-bar-container">
                    <div
                      className="Teamprogress-bar"
                      style={{
                        width: `${calculatePercentage(
                          row.StartMonth,
                          row.StartMonth === 1
                            ? row.EndMonth
                            : row?.EndMonth - row.StartMonth + 1
                        )}%`,
                      }}
                    >
                      { currentMonth < row.StartMonth ? <div></div>: calculatePercentage(
                        row.StartMonth,
                        row.EndMonth
                      )}
                      %
                    </div>
                  </div>
                </td>
                {[
                  ...Array(
                     12 -
                      (row.StartMonth === 1
                        ? row?.EndMonth + row.StartMonth - 1
                        : row?.EndMonth)
                  ),
                ].map((_, idx) => (
                  <td key={idx} className="Teamproject-table-cell"></td>
                ))}
                {/* <td className="Teamproject-table-cell">{row.desc}</td> */}
                <td className="Teamproject-table-cell">{row.Manager}</td>
                <td className="Teamproject-table-cell">
                  <button
                    className="edit-button"
                    onClick={() => {
                      handleEdit(row);
                      handleRowClick(row.Users);
                    }}
                  >
                    {selectedRow === row.index ? '접기' : '수정'}
                  </button>
                  <span className="ms-1 me-1"> / </span>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(row)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamProjectBoard;
