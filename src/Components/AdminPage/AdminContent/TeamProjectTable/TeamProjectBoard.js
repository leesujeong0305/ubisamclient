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

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

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
    const months = [1,3,5,7,8,10,12];
    let percentage = 0;
    let cut = 0;
    if (currentMonth > endDate)
      return 100;
    if (startDate > endDate)
      return 100;
    if (startDate === 1) {
      const ratio = currentMonth / endDate;
      percentage = ratio * 100;
      cut = endDate - (startDate + 1);
    } else {
      const ratio = currentMonth / (endDate );
      percentage = ratio * 100;
      cut = endDate - (startDate);
    }

    const per = percentage / cut;

    let cnt = 0;
    if (endDate === 2)
      cnt = per/27;
    else if (months.includes(endDate))
      cnt = per/31;
    else
      cnt = per/30;
    
    //percentage = (per * (cut-1)) + (cnt * today.getDate()); // 몇주차 체크 6: 1주차, 4: 2주차, 2: 3주차 
    // if (startDate === 1) { //비율에 대한 보정값
    //   if (endDate < 10 && today.getDate() < 15 ) {
    //     percentage = percentage + (cnt * 10);
    //     //console.log('percentage1', percentage, currentMonth);
    //   }
    //   else if (endDate < 10 && today.getDate() < 26) {
    //     percentage = percentage + (cnt);
    //     //console.log('percentage2', percentage);
    //   }
    // } else {
    //   if (currentMonth + 2 >= endDate && today.getDate() < 15 )
    //     percentage = percentage + (cnt * 10);
    //   else if (currentMonth + 2 >= endDate && today.getDate() < 15)
    //     percentage = percentage + (cnt);
    //   else if (currentMonth < endDate && today.getDate() < 26)
    //     percentage = percentage - (cnt * 10);
    // }
    // else
    //console.log('percentage3', percentage);
    //percentage = percentage + (cut/2);
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
      formValues.Project === undefined ||
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
        Project: formValues.Project,
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
      EndMonth: formValues.EndMonth,
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
              <th key={index} className="Teamproject-table-header-cell">
                {header}
              </th>
            ))}
          </tr>
          {/* <tr>
          {headers.map((header, index) => (
                <th key={index} className="Teamproject-table-header-cell">
                    {header.includes('월') ? (
                        Array.from({ length: 4 }, (_, idx) => (
                            <th key={idx}>{idx + 1}</th>
                        ))
                    ) : ''}
                </th>
            ))}
          </tr> */}
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
                        width: `${calculatePercentage( row.StartMonth, row.EndMonth )}%`,
                      }}
                    >
                      { currentMonth < row.StartMonth ? <div></div> : calculatePercentage( row.StartMonth, row.EndMonth ) === 100 ? '완료' : <div>{calculatePercentage( row.StartMonth, row.EndMonth )}%</div> }
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
