import React, { useEffect, useState } from 'react';
import './TeamProjectBoard.css';
import GetUserInfo from '../../../../API/GetUserInfo';
import { useSelector } from 'react-redux';
import { AddTeamProject } from '../../../../API/AddTeamProject';
import { UpdateTeamProject } from '../../../../API/UpdateTeamProject';
import { DeleteTeamProject } from '../../../../API/DeleteTeamProject';
import GetTeamProject from '../../../../API/GetTeamProject';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FaTrash } from 'react-icons/fa'
import { BiSolidHide } from "react-icons/bi";

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
    { key: '장비사업팀', value: '서울' },
  ];

  const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector((state) => state.userInfo);
  const [selectedYear, setSelectedYear] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [projectAdd, setProjectAdd] = useState(false);
  const [projectEdit, setProjectEdit] = useState(false);
  const [selectYear, setSelectYear] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [oldProject, setOldProject] = useState('');

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
      [name]: (name === 'StartWeek' || name === 'StartMonth' || name === 'EndMonth') ? parseInt(value, 10) : value,
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
    // '순번',
    '프로젝트명',
    '상태',
    '인 원',
    '제안MM',
    ...months,
    '업체 담당자',
    '수정 / 삭제',
  ];
  const states = [
    '셋업',
    '제작',
    '개발',
    '예상',
    '메인트',
    'CS',
    '완료',
    '지원',
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

  const calculatePercentage = (row) => {
    const day = today.getDate() > 23 ? 3 : today.getDate() > 16 ? 2 : today.getDate() > 9 ? 1 : 0;
    const hundred = 100;
    let percentage = 0;

    if (currentMonth > row.EndMonth || ((currentMonth === row.EndMonth) && day >= row.EndWeek))
      return hundred.toFixed(0);
    if (row.StartMonth > row.EndMonth)
      return hundred.toFixed(0);
    if (row.StartMonth > currentMonth || ((currentMonth === row.StartMonth) && day < row.StartWeek))
      return 0;

    if (row.StartMonth === 1) {
        if (row.StartWeek === 1) {
          const ratio = (row.EndMonth * 4) - (4 - row.EndWeek);
        const period = (currentMonth * 4) - (4 - day);
        percentage = period / ratio * 100;
        } else {
          const ratio = (row.EndMonth * 4) - (row.StartWeek-1) - (4 - row.EndWeek);
          const period = (currentMonth * 4) - (row.StartWeek-1) - (4 - day);
          percentage = period / ratio * 100;
        }
    } else {
      const ratio = ((row.EndMonth - row.StartMonth - 1) * 4) + (4 - (row.StartWeek - 1)) + row.EndWeek;
      const period = ((currentMonth - row.StartMonth - 1) * 4) + (4 - (row.StartWeek - 1)) + day;
      percentage = (period / ratio) * 100;
    }
    //console.log('날짜 계산', percentage);
    return percentage.toFixed(0);
  };

  const delayWeek = (row) => {
    const day = today.getDate() > 23 ? 3 : today.getDate() > 16 ? 2 : today.getDate() > 9 ? 1 : 0;
    const per = ((currentMonth - row.EndMonth) * 4) - (row.EndWeek - day);
    return per;
  }

  const delayWork = (row) => {
    let percentage = 0;
    
    if (row.StartMonth === 1) {
      if (row.StartWeek === 1) {
        const ratio = (row.EndMonth * 4) - (4 - row.EndWeek) + delayWeek(row);
        const period = (row.EndMonth * 4) - (4 - row.EndWeek);
        percentage = period / ratio * 100;
      } else {
        const ratio = (row.EndMonth * 4) - (row.StartWeek-1) - (4 - row.EndWeek) + delayWeek(row);
        const period = (row.EndMonth * 4) - (row.StartWeek-1) - (4 - row.EndWeek);
        percentage = period / ratio * 100;
      }
    } else {
      const ratio = ((row.EndMonth - row.StartMonth - 1) * 4) + (4 - (row.StartWeek - 1)) + row.EndWeek + delayWeek(row);
      const period = ((row.EndMonth - row.StartMonth - 1) * 4) + (4 - (row.StartWeek - 1)) + row.EndWeek;
      percentage = (period / ratio) * 100;
    }
      return percentage.toFixed(0);
  }

  const handleCreate = () => {
    if (projectAdd === true) {
    setProjectAdd(!projectAdd);
    setProjectEdit(false);
    setFormValues(initialData);
    setSelectedRow(null);
    setShowCheckboxes(false);
  } else {
    setProjectAdd(true);
    setFormValues(initialData);
    setCheckboxes(initCheckbox);
  }
  };

  const handleAddRow = async () => {
    const selectedUsers = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label)
      .join(', ');

      const site = selectSite();
      const data = await GetTeamProject(site);
      const projectExists = data.some(item => item.ProjectName === formValues.Project);
      if (projectExists) {
        alert('같은 이름을 가진 Project가 있습니다. 다른 이름으로 변경해 주세요');
        return;
      }
      
    if (
      formValues.Project === undefined || formValues.Status === undefined ||
      formValues.StartMonth === undefined || formValues.EndMonth === undefined ||
      selectedUsers === '' || formValues.ProopsMM === undefined ||
      formValues.Manager === undefined || formValues.StartWeek === undefined ||
      formValues.EndWeek === undefined
    ) {
      alert('입력하지 않은 항목이 존재합니다.');
    } else {

      if ((formValues.StartMonth > formValues.endMonth)) {
        alert('기간이 이상합니다 다시 선택해주세요.');
        return;
      }
      
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
    if ((formValues.StartMonth > formValues.EndMonth) || 
    ((formValues.StartMonth === formValues.EndMonth) && (formValues.StartWeek > formValues.EndWeek))) {
      alert('기간이 이상합니다 다시 선택해주세요.');
      return;
    }

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
      const data = await GetTeamProject(site);
      const projectExists = data.some(item => (item.ProjectName === formValues.Project) && (oldProject !== item.ProjectName));
      if (projectExists) {
        alert('같은 이름을 가진 Project가 있습니다. 다른 이름으로 변경해 주세요');
        return;
      }

    const row = {
      Project: formValues.Project,
      OldProjectName: oldProject,
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
    if (!window.confirm(`${row.Project} 삭제하시겠습니까?`)) {
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
      const site = selectSite();
      const users = await GetUserInfo('All', site);
      const initCheckboxes = users.map((val, index) => {
        return { id: index + 1, label: val.name, checked: false };
      });
      const initUsers = [...initCheckboxes, { id: initCheckboxes.length + 1, label: '미정', checked: false }]
      setCheckboxes(initUsers);
      setInitCheckboxes(initUsers);
      //console.log('initUsers', initUsers);
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
    <div className="team-table-container">
      <div className="Team-table-counter">
        <div className="year">
          { selectedYear[selectYear - 1] && (
            <button className="before-btn" onClick={handleBeforeYear}>
            ◀️
          </button>
          )
            
          }
          
          <span>{selectYear}년</span>
          <button className="after-btn" onClick={handleAfterYear}>
            ▶️
          </button>
        </div>
        <div>
          {
            !projectEdit && (
              <button className="create-button" onClick={handleCreate}>
            프로젝트 Add
            <i>{projectAdd ? '➖' : '➕'}</i>
          </button>
            )
          }
        </div>
      </div>
      {projectAdd && (
        <div className="team-input-parrent">
          <div className="team-input-container" style={{ width: '300px' }}>
            <label className="team-input-label">Project</label>
            <input
              type="text"
              name="Project"
              className="team-input-field"
              value={formValues.Project}
              onChange={handleInputChange}
              style={{ width: '300px' }}
            />
          </div>
          <div className="team-input-container team-dropdown-container">
            <label className={`team-input-label`}>상태</label>
            <select
              name="Status"
              className="team-input-field"
              value={formValues.Status}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {states.map((status, index) => (
                <option value={index + 1}>{status}</option>
              ))}
            </select>
          </div>

          <div className="team-input-container team-users-check">
            <button onClick={() => setShowCheckboxes(!showCheckboxes)}>
              인원 선택
            </button>
          </div>

          <div className="team-input-container">
            <label className="team-input-label">제안MM</label>
            <input
              type="text"
              name="ProopsMM"
              className="team-input-field"
              value={formValues.ProopsMM}
              onChange={handleInputChange}
            />
          </div>

          <div className="team-input-container team-dropdown-container">
            <label className="team-input-label">시작</label>
            <select
              name="StartMonth"
              className="team-input-field"
              value={formValues.StartMonth}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="team-input-container team-dropdown-container">
            <label className="team-input-label">시작 주차</label>
            <select
              name="StartWeek"
              className="team-input-field"
              value={formValues.StartWeek}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="team-input-container team-dropdown-container">
            <label className="team-input-label">끝</label>
            <select
              name="EndMonth"
              className="team-input-field"
              value={formValues.EndMonth}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          
          <div className="team-input-container team-dropdown-container">
            <label className="team-input-label">끝 주차</label>
            <select
              name="EndWeek"
              className="team-input-field"
              value={formValues.EndWeek}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="team-input-container">
            <label className="team-input-label">담당자</label>
            <input
              type="text"
              name="Manager"
              className="team-input-field"
              value={formValues.Manager}
              onChange={handleInputChange}
              style={{ width: '140px' }}
            />
          </div>
          <div className="team-input-container">
            <button
              className="team-add-button"
              style={{ backgroundColor: '#005FCC' }}
              onClick={handleAddRow}
            >
              ADD
            </button>
          </div>
        </div>
      )}

      {projectEdit && (
        <div className="team-input-parrent">
          <div className="team-input-container" style={{ width: '300px' }}>
            <label className="team-input-label">Project</label>
            <input
              type="text"
              name="Project"
              className="team-input-field"
              value={formValues.Project}
              onChange={handleInputChange}
              style={{ width: '300px' }}
            />
          </div>
          <div className="team-input-container team-dropdown-container">
            <label className={`team-input-label`}>상태</label>
            <select
              name="Status"
              className="team-input-field"
              value={formValues.Status}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {states.map((status, index) => (
                <option value={index + 1}>{status}</option>
              ))}
            </select>
          </div>

          <div className="team-input-container team-users-check">
            <button onClick={() => setShowCheckboxes(!showCheckboxes)}>
              인원 선택
            </button>
          </div>

          <div className="team-input-container">
            <label className="team-input-label">제안MM</label>
            <input
              type="text"
              name="ProopsMM"
              className="team-input-field"
              value={formValues.ProopsMM}
              onChange={handleInputChange}
            />
          </div>

          <div className="team-input-container team-dropdown-container">
            <label className={`team-input-label`}>시작</label>
            <select
              name="StartMonth"
              className="team-input-field"
              value={formValues.StartMonth}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="team-input-container team-dropdown-container">
            <label className={`team-input-label`}>시작 주</label>
            <select
              name="StartWeek"
              className="team-input-field"
              value={formValues.StartWeek}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="team-input-container team-dropdown-container">
            <label className={`team-input-label`}>끝</label>
            <select
              name="EndMonth"
              className="team-input-field"
              value={formValues.EndMonth}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="team-input-container team-dropdown-container">
            <label className={`team-input-label`}>끝 주</label>
            <select
              name="EndWeek"
              className="team-input-field"
              value={formValues.EndWeek}
              onChange={handleInputChange}
            >
              <option value={0}>Select</option>
              {weeks.map((week, index) => (
                <option key={index} value={index + 1}>
                  {week}
                </option>
              ))}
            </select>
          </div>

          <div className="team-input-container">
            <label className="team-input-label">담당자</label>
            <input
              type="text"
              name="Manager"
              className="team-input-field"
              value={formValues.Manager}
              onChange={handleInputChange}
              style={{ width: '140px' }}
            />
          </div>
          <div className="team-input-container">
            <button className="team-project-button" onClick={handleEditRow}>
              EDIT
            </button>
          </div>
        </div>
      )}

      <div className="team-input-parrent">
        {showCheckboxes && (
          <div>
            <div className="team-input-container team-checkbox-container">
              <input
                type="checkbox"
                id="checkbox-all"
                className="team-input-checkbox"
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
                className="team-input-container team-checkbox-container"
              >
                <input
                  type="checkbox"
                  id={`checkbox-${checkbox.id}`}
                  className="team-input-checkbox"
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

      <div className='d-flex mb-2 ms-1 justify-content-between'>
        <div className='d-flex mb-2'>
        <div className='circle me-2' style={{backgroundColor: '#EB5B00'}}></div>
          <div className='me-3'>일정 지연</div>
          <div className='circle me-2' style={{backgroundColor: '#009570'}}></div>
          <div className='me-3'>프로젝트 완료</div>
          <div className='circle me-2' style={{backgroundColor: '#e9d819'}}></div>
          <div className='me-3'>프로젝트 진행 예정</div>
          <div className='circle me-2' style={{backgroundColor: '#3FA2F6'}}></div>
          <div className='me-3'>지원</div>
        </div>
          <div>
            <span className='me-2' style={{fontWeight: 'bold', fontSize: '14px'}}>{`현재 : ${currentMonth}월 ${today.getDate() > 23 ? 4 : today.getDate() > 16 ? 3 : today.getDate() > 9 ? 2 : 1}주차`}</span>
          </div>
        
      </div>

      <table className="Teamproject-table pre-line-project">
      <thead className="Teamproject-head">
        <tr className="Teamproject-table-header">
          {/* <th className="Teamproject-table-header-cell col-id" rowSpan="2">#</th> */}
          <th className="Teamproject-table-header-cell col-project" rowSpan="2">프로젝트명</th>
          <th className="Teamproject-table-header-cell col-status" rowSpan="2">상태</th>
          <th className="Teamproject-table-header-cell col-users" rowSpan="2">인 원</th>
          <th className="Teamproject-table-header-cell col-suggest-mm" rowSpan="2">제안<br/>MM</th>
          {Array.from({ length: 12 }, (_, monthIdx) => (
              <th key={`month-${monthIdx}`} className="Teamproject-table-header-cell col-month" colSpan={4}>
                  {`${monthIdx + 1}월`}
              </th>
          ))}
          <th className="Teamproject-table-header-cell col-company-mm" rowSpan="2">업체<br/>담당자</th>
          <th className="Teamproject-table-header-cell col-edit-delete" rowSpan="2">수정/삭제</th>
        </tr>
        <tr className="Teamproject-table-subheader">
            {Array.from({ length: 12 }, (_, monthIdx) => (
                Array.from({ length: 4 }, (_, idx) => (
                    <th key={`month-${monthIdx}-week-${idx}`} className="Teamproject-table-header-cell col-week">
                        {`${idx + 1}`}
                    </th>
                ))
            ))}
        </tr>
    </thead>
        <tbody>
          {(selectedYear && selectYear) && selectedYear[selectYear] &&
            selectedYear[selectYear]?.map((row, index) => (
              <tr key={index} className="Teamproject-table-row">
                {/* <td className="Teamproject-table-cell">{row.id}</td> */}
                <td className="Teamproject-table-cell project-cell-overflow" title={row.Project}>{row.Project}</td>
                <td className="Teamproject-table-cell" style={{backgroundColor: row.Status - 1 === 7 ? '#3FA2F6' : (calculatePercentage( row ) === '100' && row.Status - 1 === 6) ? '#009570'
                    : (calculatePercentage( row ) === '100' && row.Status - 1 !== 6) ? '#EB5B00' : row.Status - 1 === 3 ? '#e9d819' :'' }}>
                  {states[row.Status - 1] }</td>
                <td className="Teamproject-table-cell users-cell-overflow" title={row.Users}>{row.Users}</td>
                <td className="Teamproject-table-cell">{`${row.ProopsMM}`}</td>
                { row.StartMonth && blankWeekBefore(row.StartMonth, row.StartWeek) !== 0 && [...Array(blankWeekBefore(row.StartMonth, row.StartWeek))]?.map((_, idx) => (
                  <td key={idx} className="Teamproject-table-cell"></td>
                ))}
                  
                    <td
                   className="Teamproject-table-cell"
                   colSpan={
                    sumWeek(row.StartMonth, row.EndMonth, row.StartWeek, row.EndWeek) + ((calculatePercentage( row ) === '100' && row.Status - 1 !== 6 && row.Status - 1 !== 7) ? delayWeek(row) : 0)
                   }
                 >
                  <div className="Teamprogress-bar-container" 
                   style={{width: ((row.StartMonth === row.EndMonth) && (row.StartWeek === row.EndWeek)) && '20px',
                   marginRight: ((row.StartMonth === row.EndMonth) && (row.StartWeek === row.EndWeek)) && '-12px',
                   marginLeft:  ((row.StartMonth === row.EndMonth) && (row.StartWeek === row.EndWeek)) && '-3px', 
                   background: (calculatePercentage( row ) === '100' && row.Status - 1 !== 6 && row.Status - 1 !== 7) && '#FC5C9C' //F73859
                  }}
                 >
                    <div
                      className="Teamprogress-bar"
                      style={{
                        width: `${(calculatePercentage( row ) === '100' && row.Status - 1 !== 6 && row.Status - 1 !== 7) ? delayWork(row) : calculatePercentage( row ) }%`,
                         backgroundColor: row.Status - 1 === 7 ? '#3FA2F6' : (calculatePercentage( row ) === '100' && row.Status - 1 === 6) ? '#009570' :
                          row.Status - 1 === 3 ? '#e9d819' : '', //(calculatePercentage( row ) === '100' && row.Status - 1 !== 6) ? '#EB5B00' :
                        color: row.Status - 1 === 3 ? '#222' : (calculatePercentage( row ) === '100' && row.Status - 1 !== 6 && row.Status - 1 !== 7) && '#FFCEF3' , //FDFDC4
                        justifyContent: (calculatePercentage( row ) === '100' && row.Status - 1 !== 6 && row.Status - 1 !== 7) && 'right',
                        whiteSpace : 'pre-wrap',
                      }}
                    >
                      {
                       ((currentMonth < row.StartMonth) || (row.StartMonth === row.EndMonth && row.StartWeek === row.EndWeek)) ? <div></div> : 
                       ((calculatePercentage( row ) === '100' && row.Status - 1 === 6) || (calculatePercentage( row ) === '100' && row.Status - 1 === 7)) ? '완료' 
                       : ((calculatePercentage( row ) === '100' && row.Status - 1 !== 6)) ? '지연  ' : <div>{calculatePercentage( row ) === 0 ? '' : `${calculatePercentage( row )}%`}</div>
                      }
                    </div>
                    
                  </div>
                </td>
                { row.EndMonth && blankWeekAfter(row.EndMonth, row.EndWeek) !== 0 &&
                [
                  ...Array(blankWeekAfter(row.EndMonth, row.EndWeek) - ((calculatePercentage( row ) === '100' && row.Status - 1 !== 6 && row.Status - 1 !== 7) ? delayWeek(row) : 0)),
                ].map((_, idx) => (
                  <td key={idx} className="Teamproject-table-cell"></td>
                ))}
                {/* <td className="Teamproject-table-cell">{row.desc}</td> */}
                <td className="Teamproject-table-cell manager-cell-overflow" title={row.Manager}>{row.Manager}</td>
                <td className="Teamproject-table-cell">
                  <button
                    className={selectedRow === row.id ? `edit-button-click` : `edit-button`}
                    onClick={() => {
                      handleEdit(row);
                      handleRowClick(row.Users);
                      setOldProject(row.Project);
                    }}
                  >
                    {selectedRow === row.id ? <BiSolidHide /> : <FontAwesomeIcon icon={faPenToSquare} />}
                  </button>
                  <button
                    className="delete-button ms-2"
                    onClick={() => handleDelete(row)}
                  >
                    <FaTrash />
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
