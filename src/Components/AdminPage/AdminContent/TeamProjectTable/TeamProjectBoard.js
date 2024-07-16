import React, { useEffect, useState } from 'react';
import './TeamProjectBoard.css';
import GetUserInfo from '../../../../API/GetUserInfo';
import { useSelector } from 'react-redux';
import { AddTeamProject } from '../../../../API/AddTeamProject';
import { UpdateTeamProject } from '../../../../API/UpdateTeamProject';
import { DeleteTeamProject } from '../../../../API/DeleteTeamProject';

const TeamProjectBoard = ({ posts, handleUpdate }) => {
  const initialData = [
    {
      Project: '',
      Date: '',
      Status: 0,
      StartMonth: 0,
      StartWeek: 0,
      EndMonth: 0,
      EndWeek: 0,
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

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: (name === 'StartWeek') || (name === 'EndWeek') ? parseInt(value, 10) : value,
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

  const weeks = [
    '1주',
    '2주',
    '3주',
    '4주',
  ]

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

  const calculatePercentage = (startDate, endDate, startWeek, endWeek) => {
    const months = [1,3,5,7,8,10,12];

    const day = today.getDate() > 23 ? 3 : today.getDate() > 16 ? 2 : today.getDate() > 9 ? 1 : 0;

    let percentage = 0;
    let cut = 0;
    if (currentMonth > endDate)
      return 100;
    if (startDate > endDate)
      return 100;
    
    if (startDate === 1) {
      // const ratio = ((endDate - startDate - 1) * 4) - startWeek - 1 + endWeek - 1; // 총기간
      // const period = ((currentMonth - startDate) * 4) - startWeek - 1 + day;
        if (startWeek === 1) {
          const ratio = ((endDate) * 4) - (4 - endWeek); // 총기간  24 - (4 - 3 -1) + () //29
        const period = ((currentMonth) * 4) - (4 - day); // 25
        console.log('총기간 ', ratio, '실제기간 ', period, 'day', day);
        percentage = period / ratio * 100;
        } else {
          const ratio = ((endDate) * 4) - (startWeek === 4 ? startWeek - 1 : (4- (startWeek-1))) - (4 - endWeek); // 총기간  8 * 4 - (4- (4-1)) - (4-(1))    26
          const period = ((currentMonth) * 4) - (startWeek === 4 ? startWeek - 1 : (4- (startWeek-1))) - (4 - day); // 20 + 2    28 - 3 -
          console.log('총기간 ', ratio, '실제기간 ', period, 'day', day);
          percentage = period / ratio * 100;
        }
    } else {
      const ratio = ((endDate - (startDate - 1)) * 4) - (4 - endWeek); // 8*4 = 32 + 3
        const period = ((currentMonth) * 4) - (4 - day); // 25
        console.log('총기간 ', ratio, '실제기간 ', period, 'day', day);
        percentage = period / ratio * 100;
      if (startWeek === 1) {

      }
      
    }

    return percentage.toFixed(2);
  };

  const handleCreate = () => {
    if (projectAdd === true) {
    setProjectAdd(!projectAdd);
    setProjectEdit(false);
    setFormValues(initialData);
    setSelectedRow(null);
  } else {
    setProjectAdd(true);
  }
  };

  const handleAddRow = async () => {
    const selectedUsers = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label)
      .join(', ');
    if (
      formValues.Project === undefined || formValues.Status === undefined ||
      formValues.StartMonth === undefined || formValues.EndMonth === undefined ||
      selectedUsers === '' || formValues.ProopsMM === undefined ||
      formValues.Manager === undefined || formValues.StartWeek === undefined ||
      formValues.EndWeek
    ) {
      alert('입력하지 않은 항목이 존재합니다.');
    } else {
      const site = selectSite();
      const row = {
        Project: formValues.Project,
        Date: dateString,
        Status: formValues.Status,
        StartMonth: formValues.StartMonth,
        StartWeek: formValues.StartWeek,
        EndMonth: formValues.EndMonth,
        EndWeek: formValues.EndWeek,
        Users: selectedUsers,
        ProopsMM: formValues.ProopsMM,
        Manager: formValues.Manager,
      };

      const result = await AddTeamProject(row, site);

      setFormValues(initialData);
      setProjectAdd(false);
      setShowCheckboxes(false);
      setCheckboxes(initCheckbox);

      handleUpdate(true);
    }
  };

  const handleEditRow = async () => {
    if (!window.confirm('수정시겠습니까?')) {
      // 사용자가 Cancel을 클릭한 경우
      //console.log('프로젝트 수정이 취소되었습니다.');
      return;
    }

    const selectedUsers = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label)
      .join(', ');

    const site = selectSite();
    const row = {
      Project: formValues.Project,
      Date: dateString,
      Status: formValues.Status,
      StartMonth: formValues.StartMonth,
      StartWeek: formValues.StartWeek,
      EndMonth: formValues.EndMonth,
      EndWeek: formValues.EndWeek,
      Users: selectedUsers,
      ProopsMM: formValues.ProopsMM,
      Manager: formValues.Manager,
    };

    const result = await UpdateTeamProject(row, site);

    setProjectAdd(false);
    setProjectEdit(false);
    setShowCheckboxes(false);
    setCheckboxes(initCheckbox);
    setSelectedRow(null);

    handleUpdate(true);
  };

  const handleEdit = (row) => {
    //console.log('project', row);
    setFormValues(row);
    if (selectedRow === row.id) {
      setProjectEdit(false);
      setSelectedRow(null);
      setShowCheckboxes(false);
    } else {
      setProjectAdd(false);
      setProjectEdit(true);
      setSelectedRow(row.id);
      setShowCheckboxes(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm('삭제하시겠습니까?')) {
      // 사용자가 Cancel을 클릭한 경우
      //console.log('프로젝트 수정이 취소되었습니다.');
      return;
    }

    const site = selectSite();
    const rowData = row.Project;

    const result = await DeleteTeamProject(rowData, site);

    setProjectAdd(false);
    setProjectEdit(false);
    setShowCheckboxes(false);
    setCheckboxes(initCheckbox);
    setSelectedRow(null);

    handleUpdate(true);
  };

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

  const blankWeekBefore = (month, week) => {
    if (month === 1) { // 시작 달이 1월달일때
      if (week === 1)
        return 0;
      else
        return week - 1;
    } else {
      return ((month - 1) * 4) + (week-1);
    }
  }

  const sumWeek = (startMonth, endMonth, startWeek, endWeek) => {
    if (startMonth === 1) { // 시작 달이 1월달일때
      if (startWeek === 1)
        return ((endMonth - 1) * 4) + (endWeek);
      else
        return ((endMonth - 1) * 4) + endWeek - (startWeek - 1);

    } else if (startWeek === 1) {
      return ((endMonth - startMonth) * 4) + (endWeek);
    } else if (startWeek !== 1) {
      return ((endMonth - startMonth) * 4) + endWeek - (startWeek - 1);
    }
  }

  const blankWeekAfter = (month, week) => {
    if (month === 12) {
      if (week === 4)
        return 0;
    } else {
      return 48 - ((month) * 4) + (4 - week);
    }
  }

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
      //console.log('groupedData', groupedData);
      setSelectedYear(groupedData);
      
    };
    LoadTeamUsers();
    //console.log('posts', posts);
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
              name="Project"
              className="input-field"
              value={formValues.Project}
              onChange={handleInputChange}
              style={{ width: '300px' }}
            />
          </div>
          <div className="input-container dropdown-container">
            <label className={`input-label`}>상태</label>
            <select
              name="Status"
              className="input-field"
              value={formValues.Status}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {states.map((status, index) => (
                <option value={index + 1}>{status}</option>
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
              name="ProopsMM"
              className="input-field"
              value={formValues.ProopsMM}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>시작</label>
            <select
              name="StartMonth"
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
            <label className={`input-label`}>시작 주</label>
            <select
              name="StartWeek"
              className="input-field"
              value={formValues.StartWeek}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>끝</label>
            <select
              name="EndMonth"
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
          
          <div className="input-container dropdown-container">
            <label className={`input-label`}>끝 주</label>
            <select
              name="StartWeek"
              className="input-field"
              value={formValues.EndWeek}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container">
            <label className="input-label">담당자</label>
            <input
              type="text"
              name="Manager"
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
              name="Project"
              className="input-field"
              value={formValues.Project}
              onChange={handleInputChange}
              style={{ width: '300px' }}
            />
          </div>
          <div className="input-container dropdown-container">
            <label className={`input-label`}>Status</label>
            <select
              name="Status"
              className="input-field"
              value={formValues.Status}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {states.map((status, index) => (
                <option value={index + 1}>{status}</option>
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
              name="ProopsMM"
              className="input-field"
              value={formValues.ProopsMM}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>시작</label>
            <select
              name="StartMonth"
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
            <label className={`input-label`}>시작 주</label>
            <select
              name="StartWeek"
              className="input-field"
              value={formValues.StartWeek}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container dropdown-container">
            <label className={`input-label`}>끝</label>
            <select
              name="EndMonth"
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

          <div className="input-container dropdown-container">
            <label className={`input-label`}>끝 주</label>
            <select
              name="EndWeek"
              className="input-field"
              value={formValues.EndWeek}
              onChange={handleInputChange}
            >
              <option value="0">Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container">
            <label className="input-label">담당자</label>
            <input
              type="text"
              name="Manager"
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

      <table className="Teamproject-table pre-line-project">
        <thead className="Teamproject-head">
          <tr className="Teamproject-table-header">
            {headers.map((header, index) => (
              <th key={index} className="Teamproject-table-header-cell" colSpan={header.includes('월') ? 4 : 1}>
                {header}
              </th>
            ))}
          </tr>
          <tr className="Teamproject-table-subheader">
          {headers.map((header) => (
            header.includes('월') ? (
              Array.from({ length: 4 }, (_, idx) => (
                <th key={`${header}-${idx}`} className="Teamproject-table-header-cell">{`${idx + 1}`}</th>
              ))
            ) : (
              <th key={header} className="Teamproject-table-header-cell"></th>
            )
          ))}
        </tr>
        </thead>
        <tbody>
          {(selectedYear && selectYear) && selectedYear[selectYear] &&
            selectedYear[selectYear]?.map((row, index) => (
              <tr key={index} className="Teamproject-table-row">
                <td className="Teamproject-table-cell">{row.id}</td>
                <td className="Teamproject-table-cell">{row.Project}</td>
                <td className="Teamproject-table-cell">{states[row.Status - 1] || 'Unknown Status'}</td>

                <td className="Teamproject-table-cell Table-cell-overflow" title={row.Users} style={{maxWidth: '100px'}}>{row.Users}</td>
                <td className="Teamproject-table-cell">{`${row.ProopsMM}MM`}</td>
                { row.StartMonth && blankWeekBefore(row.StartMonth, row.StartWeek) !== 0 && [...Array(blankWeekBefore(row.StartMonth, row.StartWeek))]?.map((_, idx) => (
                  <td key={idx} className="Teamproject-table-cell"></td>
                ))}
                  
                    <td
                   className="Teamproject-table-cell"
                   colSpan={
                    //  row.StartMonth === 1
                    // ? row.EndMonth
                    //    : row.EndMonth - row.StartMonth + 1
                    sumWeek(row.StartMonth, row.EndMonth, row.StartWeek, row.EndWeek)
                    
                   }
                 >
                 <div className="Teamprogress-bar-container">
                    <div
                      className="Teamprogress-bar"
                      style={{
                        width: `${calculatePercentage( row.StartMonth, row.EndMonth, row.StartWeek, row.EndWeek )}%`,
                      }}
                    >
                      { currentMonth < row.StartMonth ? <div></div> : calculatePercentage( row.StartMonth, row.EndMonth, row.StartWeek, row.EndWeek ) === 100 ? '완료' : <div>{calculatePercentage( row.StartMonth, row.EndMonth, row.StartWeek, row.EndWeek )}%</div> }
                    </div>
                  </div>
                </td>
                { row.EndMonth && blankWeekAfter(row.EndMonth, row.EndWeek) !== 0 &&
                [
                  ...Array(blankWeekAfter(row.EndMonth, row.EndWeek)),
                ].map((_, idx) => (
                  <td key={idx} className="Teamproject-table-cell"></td>
                ))}
                {/* <td className="Teamproject-table-cell">{row.desc}</td> */}
                <td className="Teamproject-table-cell">{row.Manager}</td>
                <td className="Teamproject-table-cell">
                  <button
                    className={selectedRow === row.id ? `edit-button-click` : `edit-button`}
                    onClick={() => {
                      handleEdit(row);
                      handleRowClick(row.Users);
                    }}
                  >
                    {selectedRow === row.id ? '접기' : '수정'}
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
