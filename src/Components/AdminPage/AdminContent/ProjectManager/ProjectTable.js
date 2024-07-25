import React, { useEffect, useState } from 'react';
import './ProjectTable.css';
import Pagination from '../../../../Board/Page/Pagination';
import { AddProjectInfo } from '../../../../API/AddProjectInfo';
import GetUserInfo from '../../../../API/GetUserInfo';
import { useSelector } from 'react-redux';
import { UpdateProjectInfo } from '../../../../API/UpdateProjectInfo';
import { GetProjectInfo } from '../../../../API/GetProjectInfo';

const ProjectTable = ({ projects, handleUpdate }) => {
    const initialData = [
        {
            Project: '',
            Date: '',
            PM: '',
            Users: '',
            Status: 0,
            Period: '',
            View: 0,
            Field: 0,
        },
    ];
    const Continents = [
        { key: '자동화1팀', value: '파주' },
        { key: '시스템사업팀', value: '구미' },
        { key: '장비사업팀', value: '서울' },
    ];

    const headers = [
        '순번',
        '프로젝트명',
        'PM',
        '인 원',
        '상태',
        '기간',
        // '진행 상태',
        'View',
        '수정',
    ];
    const states = [
        '대기',
        '제작',
        '셋업',
        '완료',
    ];

    const fields = ['대기', '진행', '완료',];

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

    const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector((state) => state.userInfo);

    const [viewStates, setViewStates] = useState([]);//projects.map(() => false));

    const [projectAdd, setProjectAdd] = useState(false);
    const [projectEdit, setProjectEdit] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const [postsPerPage] = useState(15); // 페이지 당 포스트 수
    const [totalPage, setTotalPage] = useState(0); //전체 Page 수


    const [selectedRow, setSelectedRow] = useState(null);

    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [initCheckbox, setInitCheckboxes] = useState([]);
    const [checkboxes, setCheckboxes] = useState([]);



    const [formValues, setFormValues] = useState([]); //initialData

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevData) => ({
            ...prevData,
            [name]: name === 'Field' ? parseInt(value, 10) : value,
        }));
    };


    // 현재 표시할 포스트 계산
    const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지의 마지막 포스트 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지의 첫 포스트 인덱스
    const currentPosts = projects.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지의 포스트 슬라이스

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호를 받아 현재 페이지 상태를 업데이트

    const handleToggle = async (row) => {
        setViewStates((prevStates) =>
            prevStates.map((state, i) => (i === (row.id - 1) ? !state : state))
        );

        const site = selectSite();
        const result = await UpdateProjectInfo(row, site, true);
    };

    const handleEdit = (row) => {
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

    const handleCreate = () => {
        if (projectAdd === true) {
            setProjectAdd(false);
            setSelectedRow(null);
        }
        else
        {
            setProjectAdd(true);
            setFormValues([]); //initialData
        }
    };

    const handleAddRow = async () => {
        const selectedUsers = checkboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.label)
            .join(', ');
        const site = selectSite();
        const data = await GetProjectInfo("All", "All");
        const projectExists = data.some(item => item.ProjectName === formValues.Project);
        if (projectExists) {
            alert(`같은 이름을 가진 Project가 있습니다. 다른 이름으로 변경해 주십시오.\n(타 사이트에서 이미 사용 중인 이름은 사용 불가)`);
            return;
        }

        if (formValues.Project === undefined || formValues.Period === undefined || selectedUsers === '' || formValues.Status === undefined ) { //|| formValues.PM === undefined || formValues.Field === undefined
            alert("입력하지 않은 항목이 존재합니다.");
            
        } else {
            const row = {
                //id: rows.length ? rows[rows.length - 1].id + 1 : 1, // 새로운 행의 ID 설정
                Project: formValues.Project,
                Period: formValues.Period, // 나이를 숫자로 변환
                Users: selectedUsers,
                Status: formValues.Status,
                PM: formValues.PM,
                View: 1,
                Field: formValues.Field,
            };
            //console.log('newRow', newRow);
            await AddProjectInfo(row, site);

            setFormValues([]); //initialData
            setProjectAdd(false);
            setShowCheckboxes(false);
            setCheckboxes(initCheckbox);

            handleUpdate(true);
        }
    };

    const handleEditRow = async () => {
        if (!window.confirm('수정시겠습니까?')) {
            // 사용자가 Cancel을 클릭한 경우
            console.log('프로젝트 수정이 취소되었습니다.');
            return;
        }
        const site = selectSite();
        const selectedUsers = checkboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.label)
            .join(', ');
        
        const row = {
            //id: rows.length ? rows[rows.length - 1].id + 1 : 1, // 새로운 행의 ID 설정
            Project: formValues.Project,
            Period: formValues.Period, // 나이를 숫자로 변환
            Users: selectedUsers,
            Status: formValues.Status,
            PM: formValues.PM,
            View: formValues.View,
            Field: formValues.Field,

        };
        const result = await UpdateProjectInfo(row, site, false);

        setProjectAdd(false);
        setProjectEdit(false);
        setShowCheckboxes(false);
        setCheckboxes(initCheckbox);
        setFormValues([]); //initialData
        setSelectedRow(null);

        handleUpdate(true);
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


    useEffect(() => {
        const LoadTeamUsers = async () => {
            const site = selectSite()
            const users = await GetUserInfo('All', site);
            const initCheckboxes = users.map((val, index) => {
                return { id: index + 1, label: val.name, checked: false };
            });
            const initUsers = [...initCheckboxes, { id: initCheckboxes.length + 1, label: '미정', checked: false }]
            setCheckboxes(initUsers);
            setInitCheckboxes(initUsers);
        };
        if (projects) {
            const total = projects.length / postsPerPage;
            setTotalPage(total);
            setViewStates(projects.map(project => project.View));
        }
        LoadTeamUsers();
    }, [projects])

    return (
        <div className="project-container">
            <div className="table-counter">
                <span>총 프로젝트: {projects.length}</span>
                {
                    !projectEdit && (
                        <button className="create-button" onClick={handleCreate}>
                            프로젝트 생성&nbsp;&nbsp;
                            <i>{projectAdd ? ' ㆒' : ' ✚'}</i>
                        </button>
                    )
                }
            </div>
            {/*Project Insert*/}
            {
                projectAdd && (
                    <div className="input-parrent">
                        <div className="input-container" style={{ width: '400px' }}>
                            <label className="input-label">Project</label>
                            <input
                                type="text"
                                name="Project"
                                className="input-field"
                                value={formValues.Project}
                                onChange={handleInputChange}
                                style={{ width: '400px' }}
                            />
                        </div>
                        <div className="input-container" style={{ width: '200px' }}>
                            <label className="input-label">Period</label>
                            <input
                                type="text"
                                name="Period"
                                className="input-field"
                                value={formValues.Period}
                                onChange={handleInputChange}
                                style={{ width: '200px' }}
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

                        <div className="input-container" style={{ width: '200px' }}>
                            <label className="input-label">PM</label>
                            <input
                                type="text"
                                name="PM"
                                className="input-field"
                                value={formValues.PM}
                                onChange={handleInputChange}
                                style={{ width: '200px' }}
                            />
                        </div>

                        {/* <div className="input-container dropdown-container">
                            <label className="input-label">Field</label>
                            <select
                                name="Field"
                                className="input-field"
                                value={formValues.Field}
                                onChange={handleInputChange}
                            >
                                <option value="0">Select</option>
                                {fields.map((field, index) => (
                                    <option value={index + 1}>{field}</option>
                                ))}
                            </select>
                        </div> */}

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
                )
            }

            {/*Project Edit*/}
            {
                projectEdit && (
                    <div className="input-parrent">
                        <div className="input-container" style={{ width: '400px' }}>
                            <label className="input-label">Project</label>
                            <input
                                disabled
                                type="text"
                                name="Project"
                                className="input-field"
                                value={formValues.Project}
                                onChange={handleInputChange}
                                style={{ width: '400px' }}
                            />
                        </div>
                        <div className="input-container" style={{ width: '200px' }}>
                            <label className="input-label">Period</label>
                            <input
                                type="text"
                                name="Period"
                                className="input-field"
                                value={formValues.Period}
                                onChange={handleInputChange}
                                style={{ width: '200px' }}
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

                        <div className="input-container" style={{ width: '200px' }}>
                            <label className="input-label">PM</label>
                            <input
                                type="text"
                                name="PM"
                                className="input-field"
                                value={formValues.PM}
                                onChange={handleInputChange}
                                style={{ width: '200px' }}
                            />
                        </div>

                        {/* <div className="input-container dropdown-container">
                            <label className="input-label">Field</label>
                            <select
                                name="Field"
                                className="input-field"
                                value={formValues.Field}
                                onChange={handleInputChange}
                            >
                                <option value="0">Select</option>
                                {fields.map((field, index) => (
                                    <option value={index + 1}>{field}</option>
                                ))}
                            </select>
                        </div> */}

                        <div className="input-container">
                            <button
                                className="project-button"
                                style={{ backgroundColor: '#005FCC' }}
                                onClick={handleEditRow}
                            >
                                EDIT
                            </button>
                        </div>
                    </div>
                )
            }

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
                                    className={`checkbox-label ${checkbox.checked ? 'focused' : ''
                                        }`}
                                >
                                    {checkbox.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="project-table mb-4 pre-line-project">
                <table className="project-table">
                    <thead className="project-head">
                        <tr className="project-table-header">
                            {headers.map((header, index) => (
                                <th key={index} className="project-table-header-cell">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts?.map((row, index) => (
                            <tr key={index} className="project-table-row" >
                                <td className="project-table-cell" style={{ textAlign: 'center', width: '50px' }}>{row.id}</td>
                                <td className="project-table-cell" style={{ textAlign: 'center', width: '500px' }}>{row.ProjectName}</td>
                                <td className="project-table-cell" style={{ textAlign: 'center', width: '70px' }}>{row.PM}</td>
                                <td className="project-table-cell Table-cell-overflow" title={row.Users} style={{ maxWidth: '100px' }}>{row.Users}</td>
                                <td className="project-table-cell" style={{ textAlign: 'center', width: '70px' }}>{states[row.Status - 1] || 'Unknown Status'}</td>
                                <td className="project-table-cell" style={{ textAlign: 'center', width: '200px' }}>{row.Period}</td>
                                {/* <td className="project-table-cell">{fields[row.Field - 1] || 'Unknown Status'}</td> */}
                                <td className="project-table-cell" style={{ textAlign: 'center', width: '70px' }}>
                                    {/* <label className="switch" >
                                        <input
                                            style={{ width: '20px', height: '20px', }}
                                            type="checkbox"
                                            checked={row.View}
                                            onClick={() => {handleToggle(row.View)}}
                                        />
                                    </label> */}
                                    <label className="switch">
                                        <input
                                            style={{ width: '20px', height: '20px', }}
                                            type="checkbox"
                                            checked={viewStates[row.id - 1]}
                                            onChange={() => handleToggle(row)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td className="project-table-cell" style={{ textAlign: 'center', width: '70px' }}>
                                    <button
                                        className={selectedRow === row.id ? 'edit-button-click' : 'edit-button'}
                                        onClick={() => {
                                            handleEdit(row);
                                            handleRowClick(row.Users);
                                        }}
                                    >
                                        {selectedRow === row.id ? '접기' : '수정'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <Pagination
                    postsPerPage={postsPerPage} // 페이지 당 포스트 수
                    totalPosts={projects.length} // 전체 포스트 수
                    paginate={paginate} // 페이지 번호를 변경하는 함수
                    currentPage={currentPage} // 현재 페이지 번호
                />
            </div>
        </div>
    );
};

export default ProjectTable;