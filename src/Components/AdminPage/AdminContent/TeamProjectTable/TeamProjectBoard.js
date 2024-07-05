import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './TeamProjectBoard.css'

const TeamProjectBoard = ({ posts }) => {

    const initialData = [
        {
            project: "",
            date: "",
            state: "",
            startMonth: 0,
            endMonth: 0,
            users: "",
            proopsMM: 0,
            manager: "",
        }
    ];
    const [selectedYear, setSelectedYear] = useState([]);
    const [groupData, setGroupData] = useState([]);
    const [projectAdd, setProjectAdd] = useState(false);
    const [projectEdit, setProjectEdit] = useState(false);
    const [selectYear, setSelectYear] = useState(0);
    const [selectedRow, setSelectedRow] = useState(null);

    
    const [formValues, setFormValues] = useState(initialData);

    let today = new Date();
    let year = today.getFullYear();
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let day = ("0" + today.getDate()).slice(-2);
    let dateString = year + "-" + month + "-" + day;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [showCheckboxes, setShowCheckboxes] = useState(false);

    const initialCheckboxes = [
        { id: 1, label: '김철수', checked: false },
        { id: 2, label: '이수정', checked: false },
        { id: 3, label: '홍길동', checked: false },
        { id: 4, label: '아무개', checked: false },
    ];
    const [checkboxes, setCheckboxes] = useState(initialCheckboxes);



    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월",];

    const headers = ["순번", "프로젝트명", "상태", "인 원", "제안MM", ...months, "담당자", "수정 / 삭제"];

    const states = ["Setup", "Production Setup", "Initiation", "Development", "Planning", "Testing"];

    // const handleCheckboxChange = (id) => {
    //     setCheckboxes((prev) =>
    //         prev.map((checkbox) =>
    //             checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
    //         )
    //     );
    // };

    const handleCheckboxChange = (id) => {
        setCheckboxes(checkboxes.map(checkbox =>
            checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
        ));
    };

    const handleSelectAll = () => {
        const allChecked = checkboxes.every(checkbox => checkbox.checked);
        setCheckboxes(checkboxes.map(checkbox => ({ ...checkbox, checked: !allChecked })));
    };

    const handleRowClick = (users) => {
        const userList = users.split(', ').map(user => user.trim());
        setCheckboxes(checkboxes.map(checkbox => ({
            ...checkbox,
            checked: userList.includes(checkbox.label)
        })));
    };

    const calculatePercentage = (startDate, endDate) => {
        const ratio = startDate / endDate;
        const percentage = ratio * 100;
        return percentage.toFixed(2);
    };

    const handleCreate = () => {

        setProjectAdd(!projectAdd);
        setProjectEdit(false);
        setFormValues(initialData);
        setCheckboxes(initialCheckboxes);
        setSelectedRow(null);
    };

    const handleAddRow = async () => {
        const selectedUsers = checkboxes
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.label)
            .join(', ');

        if (true) {
            const newRow = {
                Project: formValues.project,
                Date: dateString,
                State: formValues.state,
                StartMonth: formValues.startMonth,
                EndMonth: formValues.endMonth,
                Users: selectedUsers,
                ProopsMM: formValues.proopsMM,
                Manager: formValues.manager,
            };

            console.log('newRow', newRow);

            setFormValues({
                project: "",
                date: "",
                state: "",
                startMonth: "",
                endMonth: "",
                users: "",
                proopsMM: 0,
                manager: "",
            });
            setProjectAdd(false);
            setShowCheckboxes(false);
        } else {
            alert("입력하지 않은 항목이 존재합니다.");
        }
    };

    const handleEditRow = async (row) => {

        if (true) {
            const newRow = {
                Project: formValues.project,
                Date: formValues.date,
                State: formValues.state,
                StartMonth: formValues.startMonth,
                EndMonth: formValues.endMonth,
                Users: formValues.users,
                ProopsMM: formValues.proopsMM,
                Manager: formValues.manager,
            };

            setFormValues({
                project: "",
                date: "",
                state: "",
                startMonth: "",
                endMonth: "",
                users: "",
                proopsMM: 0,
                manager: "",
            });
            setProjectAdd(false);
            setProjectEdit(false);
            setShowCheckboxes(false);
        } else {
            alert("입력하지 않은 항목이 존재합니다.");
        }
    };


    const handleEdit = (row) => {
        console.log("project", row);
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

    const handleDelete = (row) => {

    }



    const groupDataByYear = (data) => {
        return data.reduce((acc, item) => {
            const year = new Date(item.date).getFullYear();
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
    }

    const handleAfterYear = () => {
        if (groupData[selectYear + 1] === undefined) {
            alert('데이터가 없습니다');
            return;
        }
        setSelectedYear(groupData[selectYear + 1]);
        setSelectYear(selectYear + 1);
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        const filterYear = () => {
            const groupedData = groupDataByYear(posts);
            setGroupData(groupedData);
            setSelectedYear(groupedData[currentYear]);
            setSelectYear(currentYear);
        }
        filterYear();

    }, [posts])


    return (
        <div className="project-table-container">
            <div className="Teamtable-counter">
                <div className='year'>
                    <button className='before-btn' onClick={handleBeforeYear}>◀️</button>
                    <span>
                        {selectYear}년
                    </span>
                    <button className='after-btn' onClick={handleAfterYear}>▶️</button>
                </div>
                <div>

                    <button className="create-button" onClick={handleCreate}>
                        프로젝트 Add
                        <i>{projectAdd ? "➖" : "➕"}</i>
                    </button>

                </div>

            </div>
            {projectAdd && (
                <div className='input-parrent'>
                    <div className="input-container" style={{ width: '300px' }}>
                        <label className="input-label">Project</label>
                        <input
                            type="text"
                            name="project"
                            className="input-field"
                            value={formValues.project}
                            onChange={handleInputChange}
                            style={{ width: '300px' }}
                        />
                    </div>
                    <div className="input-container dropdown-container">
                        <label className={`input-label`}>상태</label>
                        <select
                            name="state"
                            className="input-field"
                            value={formValues.state}
                            onChange={handleInputChange}
                        >
                            {states.map((state, index) => (
                                <option value={index}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='input-container users-check'>
                        <button onClick={() => setShowCheckboxes(!showCheckboxes)}>인원 선택</button>
                    </div>

                    <div className="input-container">
                        <label className="input-label">제안MM</label>
                        <input
                            type="text"
                            name="proopsMM"
                            className="input-field"
                            value={formValues.proopsMM}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-container dropdown-container">
                        <label className={`input-label`}>시작</label>
                        <select
                            name="startMonth"
                            className="input-field"
                            value={formValues.startMonth}
                            onChange={handleInputChange}
                        >
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
                            value={formValues.endMonth}
                            onChange={handleInputChange}
                        >
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
                            value={formValues.manager}
                            onChange={handleInputChange}
                            style={{ width: '140px' }}
                        />
                    </div>
                    <div className="input-container">
                        <button className="project-button" style={{ backgroundColor: '#005FCC' }} onClick={handleAddRow}>ADD</button>
                    </div>

                </div>
            )}

            {projectEdit && (
                <div className='input-parrent'>
                    <div className="input-container" style={{ width: '300px' }}>
                        <label className="input-label">Project</label>
                        <input
                            disabled
                            type="text"
                            name="project"
                            className="input-field"
                            value={formValues.project}
                            onChange={handleInputChange}
                            style={{ width: '300px' }}
                        />
                    </div>
                    <div className="input-container dropdown-container">
                        <label className={`input-label`}>상태</label>
                        <select
                            name="state"
                            className="input-field"
                            value={formValues.state}
                            onChange={handleInputChange}
                        >
                            {states.map((state, index) => (
                                <option value={index}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='input-container users-check'>
                        <button onClick={() => setShowCheckboxes(!showCheckboxes)}>인원 선택</button>
                    </div>

                    <div className="input-container">
                        <label className="input-label">제안MM</label>
                        <input
                            type="text"
                            name="proopsMM"
                            className="input-field"
                            value={formValues.proopsMM}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-container dropdown-container">
                        <label className={`input-label`}>시작</label>
                        <select
                            name="startMonth"
                            className="input-field"
                            value={formValues.startMonth}
                            onChange={handleInputChange}
                        >
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
                            value={formValues.endMonth}
                            onChange={handleInputChange}
                        >
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
                            value={formValues.manager}
                            onChange={handleInputChange}
                            style={{ width: '140px' }}
                        />
                    </div>
                    <div className="input-container">
                        <button className="project-button" onClick={handleEditRow}>EDIT</button>
                    </div>

                </div>
            )}

            <div className='input-parrent'>
                {showCheckboxes && (
                    <div>
                        <div className="input-container checkbox-container">
                            <input
                                type="checkbox"
                                id="checkbox-all"
                                className="input-checkbox"
                                onChange={handleSelectAll}
                                checked={checkboxes.every(checkbox => checkbox.checked)}
                            />
                            <label htmlFor="checkbox-all" className="checkbox-label">All</label>
                        </div>
                        {checkboxes.map((checkbox) => (
                            <div key={checkbox.id} className="input-container checkbox-container">
                                <input
                                    type="checkbox"
                                    id={`checkbox-${checkbox.id}`}
                                    className="input-checkbox"
                                    checked={checkbox.checked}
                                    onChange={() => handleCheckboxChange(checkbox.id)}
                                />
                                <label
                                    htmlFor={`checkbox-${checkbox.id}`}
                                    className={`checkbox-label ${checkbox.checked ? 'focused' : ''}`}
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
                    {selectedYear && selectedYear.map((row, index) => (
                        <tr key={index} className="Teamproject-table-row">
                            <td className="Teamproject-table-cell">{row.index}</td>
                            <td className="Teamproject-table-cell">{row.project}</td>
                            <td className="Teamproject-table-cell">{row.state}</td>

                            <td className="Teamproject-table-cell">{row.users}</td>
                            <td className="Teamproject-table-cell">{`${row.proopsMM}MM`}</td>
                            {[...Array(row.startMonth - 1)].map((_, idx) => (
                                <td key={idx} className="Teamproject-table-cell"></td>
                            ))}
                            <td className="Teamproject-table-cell" colSpan={row.startMonth === 1 ? row.endMonth : row.endMonth - row.startMonth + 1}>
                                <div className="Teamprogress-bar-container">
                                    <div className="Teamprogress-bar" style={{ width: `${calculatePercentage(row.months, row.startMonth === 1 ? row.endMonth : row?.endMonth - row.startMonth + 1)}%` }}>
                                        {calculatePercentage(row.months, (row.startMonth === 1 ? row.endMonth : row?.endMonth - row.startMonth + 1))}%
                                    </div>
                                </div>

                            </td>
                            {[...Array((12) - (row.startMonth === 1 ? row?.endMonth + row.startMonth - 1 : row?.endMonth))].map((_, idx) => (
                                <td key={idx} className="Teamproject-table-cell"></td>
                            ))}
                            {/* <td className="Teamproject-table-cell">{row.desc}</td> */}
                            <td className="Teamproject-table-cell">{row.manager}</td>
                            <td className="Teamproject-table-cell">
                                <button
                                    className="edit-button"
                                    onClick={() => { handleEdit(row); handleRowClick(row.users); }}
                                >
                                    {selectedRow === row.index ? '접기' : '수정'}
                                </button>
                                <span className='ms-1 me-1'> / </span>
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
    )
}

export default TeamProjectBoard
