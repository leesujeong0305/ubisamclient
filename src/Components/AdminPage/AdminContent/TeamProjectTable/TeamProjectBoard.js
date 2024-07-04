import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './TeamProjectBoard.css'

const TeamProjectBoard = ({ posts }) => {
    const [selectedRow, setSelectedRow] = useState(null);

    const [projectAdd, setProjectAdd] = useState(false);
    const [projectEdit, setProjectEdit] = useState(false);

    const [projectData, setProjectData] = useState({
        index: "",
        part: "",
        state: "",
        name: "",
        startMonth: "",
        endMonth: "",
        months: "",
        users: "",
        desc: "",
    });



    // const [value, setValue] = useState("");
    // const [value, setValue] = useState("");
    // const [value, setValue] = useState("");
    // const [value, setValue] = useState("");

    // const [value, setValue] = useState({
    //     index: "",
    //     part: "",
    //     name: "",
    //     startMonth: "",
    //     endMonth: "",
    //     months: "",
    //     users: "",
    //     state: "",
    //     desc: "",
    // });
    const [project, setProject] = useState("");
    const [part, setPart] = useState("");
    const [month, setMonth] = useState("");
    const [dese, setDese] = useState("");

    const [formValues, setFormValues] = useState({
        index: "",
        project: '',
        part: "",
        state: "",
        name: "",
        startMonth: "",
        endMonth: "",
        months: "",
        users: "",
        desc: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    //   const fields = [
    //     { name: 'project', label: 'Project' },
    //     { name: 'part', label: 'Part' },
    //     { name: 'month', label: '진행개월수' },
    //     { name: 'dese', label: '이슈 및 보고' },
    //   ];

    const [dropdownFocused, setDropdownFocused] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('');

    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [checkboxes, setCheckboxes] = useState([
        { id: 1, label: '김철수', checked: false },
        { id: 2, label: '이수정', checked: false },
        { id: 3, label: '홍길동', checked: false },
        { id: 4, label: '아무개', checked: false },
    ]);



    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월",];

    const headers = ["순번", "프로젝트명", "파트", "상태", "인 원", "진행률", ...months, "이슈 및 비교", "수정", "삭제"];

    const states = ["Setup", "Production Setup", "Initiation", "Development", "Planning", "Testing"];

    const handleCheckboxChange = (id) => {
        setCheckboxes((prev) =>
            prev.map((checkbox) =>
                checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
            )
        );
    };

    const handleSelectAll = () => {
        const allChecked = checkboxes.every(checkbox => checkbox.checked);
        setCheckboxes((prev) =>
            prev.map((checkbox) => ({ ...checkbox, checked: !allChecked }))
        );
    };

    const calculatePercentage = (startDate, endDate) => {
        const ratio = startDate / endDate;
        const percentage = ratio * 100;
        return percentage.toFixed(2);
    };

    const handleCreate = () => {
        setProjectAdd(!projectAdd);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // const handleAddChange = (e) => {
    //     const { name, value } = e.target;
    //     setValue((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    const handleAddRow = async () => {
        if (true) {
            const newRow = {
                Project: projectData.name,
                Part: projectData.part,
                StartMonth: projectData.startMonth,
                EndMonth: projectData.endMonth,
                Months: projectData.months,
                Users: projectData.users,
                State: projectData.state,
                Desc: projectData.desc,
            };

            setProjectData({
                part: "",
                name: "",
                startMonth: "",
                endMonth: "",
                months: "",
                users: "",
                state: "",
                desc: "",
            });
            setProjectAdd(false);
        } else {
            alert("입력하지 않은 항목이 존재합니다.");
        }
    };

    const handleEditRow = async () => {
        if (true) {
            const newRow = {
                Project: projectData.name,
                Part: projectData.part,
                StartMonth: projectData.startMonth,
                EndMonth: projectData.endMonth,
                Months: projectData.months,
                Users: projectData.users,
                State: projectData.state,
                Desc: projectData.desc,
            };

            setProjectData({
                part: "",
                name: "",
                startMonth: "",
                endMonth: "",
                months: "",
                users: "",
                state: "",
                desc: "",
            });
            setProjectAdd(false);
        } else {
            alert("입력하지 않은 항목이 존재합니다.");
        }
    };

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const handleEdit = (row) => {
        console.log("project", row);
        if (projectEdit) {
            setProjectEdit(false);
            setSelectedRow(null);
        } else {
            setProjectAdd(false);
            setProjectEdit(true);

        }
    };

    const handleDelete = (row) => {

    }

    useEffect(() => {
        console.log('posts', posts);
        setProjectData(posts);

    }, [posts])

    return (
        <div className="project-table-container">
            <div className="Teamtable-counter">
                <span>총 프로젝트: {posts?.length}</span>
                <span>
                    현재 기준: {currentYear}.{currentMonth}
                </span>
                {!projectEdit && (
                    <button className="TeamProjectBoard" onClick={handleCreate}>
                        프로젝트 생성
                        <i>{projectAdd ? "➖" : "➕"}</i>
                    </button>
                )}
            </div>
            {projectAdd && (
                <div className='input-parrent'>
                    <div className="input-container">
                        <label className="input-label">Project</label>
                        <input
                            type="text"
                            name="project"
                            className="input-field"
                            value={formValues.project}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label">Part</label>
                        <input
                            type="text"
                            name="part"
                            className="input-field"
                            value={formValues.part}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container dropdown-container">
                        <label className={`input-label ${dropdownFocused || dropdownValue ? 'focused' : ''}`}>상태</label>
                        <select
                            name="state"
                            className="input-field"
                            value={formValues.state}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a project</option>
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

                    <div className="input-container dropdown-container">
                        <label className={`input-label ${dropdownFocused || dropdownValue ? 'focused' : ''}`}>시작</label>
                        <select
                            name="startMonth"
                            className="input-field"
                            value={formValues.startMonth}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a project</option>
                            {months.map((month, index) => (
                                <option key={index} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-container dropdown-container">
                        <label className={`input-label ${dropdownFocused || dropdownValue ? 'focused' : ''}`}>끝</label>
                        <select
                            name="endMonth"
                            className="input-field"
                            value={formValues.endMonth}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a project</option>
                            {months.map((month, index) => (
                                <option key={index} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label className="input-label">진행개월수</label>
                        <input
                            type="text"
                            name="month"
                            className="input-field"
                            value={formValues.months}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label">이슈 및 보고</label>
                        <input
                            type="text"
                            name="desc"
                            className="input-field"
                            value={formValues.desc}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <button className="project-button" onClick={handleAddRow}>ADD</button>
                    </div>

                </div>
            )}


            {projectEdit && (
                <div className='input-parrent'>
                    <div className="input-container">
                        <label className="input-label">Project</label>
                        <input
                            disabled
                            type="text"
                            name="project"
                            className="input-field"
                            value={formValues.project}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label">Part</label>
                        <input
                            type="text"
                            name="part"
                            className="input-field"
                            value={formValues.part}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container dropdown-container">
                        <label className={`input-label ${dropdownFocused || dropdownValue ? 'focused' : ''}`}>상태</label>
                        <select
                            name="state"
                            className="input-field"
                            value={formValues.state}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a project</option>
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

                    <div className="input-container dropdown-container">
                        <label className={`input-label ${dropdownFocused || dropdownValue ? 'focused' : ''}`}>시작</label>
                        <select
                            name="startMonth"
                            className="input-field"
                            value={formValues.startMonth}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a project</option>
                            {months.map((month, index) => (
                                <option key={index} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-container dropdown-container">
                        <label className={`input-label ${dropdownFocused || dropdownValue ? 'focused' : ''}`}>끝</label>
                        <select
                            name="endMonth"
                            className="input-field"
                            value={formValues.endMonth}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select a project</option>
                            {months.map((month, index) => (
                                <option key={index} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label className="input-label">진행개월수</label>
                        <input
                            type="text"
                            name="month"
                            className="input-field"
                            value={formValues.months}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label">이슈 및 보고</label>
                        <input
                            type="text"
                            name="desc"
                            className="input-field"
                            value={formValues.desc}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-container">
                        <button className="project-button" onClick={handleAddRow}>ADD</button>
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
                    {posts && posts.map((row, index) => (
                        <tr key={index} className="Teamproject-table-row">
                            <td className="Teamproject-table-cell">{row.index}</td>
                            <td className="Teamproject-table-cell">{row.projectName}</td>
                            <td className="Teamproject-table-cell">{row.part}</td>
                            <td className="Teamproject-table-cell">{row.state}</td>
                            <td className="Teamproject-table-cell">{row.users}</td>
                            <td className="Teamproject-table-cell">{row.months}/{row.endMonth}</td>
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
                            <td className="Teamproject-table-cell">{row.desc}</td>
                            <td className="Teamproject-table-cell">
                                <button
                                    className="edit-button"
                                    onClick={() => handleEdit(row)}
                                >
                                    수정
                                </button>
                            </td>
                            <td className="Teamproject-table-cell">
                                <button
                                    className="edit-button"
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
