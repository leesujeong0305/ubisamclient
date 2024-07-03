import React, { useState } from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './TeamProjectBoard.css'

const TeamProjectBoard = ({ posts }) => {
    const [selectedRow, setSelectedRow] = useState(null);

    const [projectAdd, setProjectAdd] = useState(false);
    const [projectEdit, setProjectEdit] = useState(false);

    const [projectPart, setProjectPart] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectStartMonth, setProjectStartMonth] = useState("");
    const [projectEndMonth, setProjectEndMonth] = useState("");
    const [projectMonths, setProjectMonths] = useState("");
    const [projectUsers, setProjectUsers] = useState("");
    const [projectState, setProjectState] = useState("");
    const [projectDesc, setProjectDesc] = useState("");

    const handleCheckboxChange = (index) => {
        setSelectedRow(index);


    };

    const handleAddRow = async () => {
        //if (projectPart && projectName && projectEndMonth && projectStartMonth && projectUsers && projectState && projectMonths) {
        if (true) {
            const newRow = {
                //id: rows.length ? rows[rows.length - 1].id + 1 : 1, // 새로운 행의 ID 설정
                Project: projectName,
                Part: projectPart,
                StartMonth: projectStartMonth,
                EndMonth: projectEndMonth, // 나이를 숫자로 변환
                Months: projectMonths,
                Users: projectUsers,
                State: projectState,
                Desc: projectDesc,
            };
            //console.log('newRow', newRow);
            //await AddProjectInfo(newRow);


            //setRows([...rows, newRow]);
            setProjectName('');
            setProjectPart('');
            setProjectUsers('');
            setProjectStartMonth('');
            setProjectEndMonth('');
            setProjectEndMonth('');
            setProjectMonths('');
            setProjectState('');
            setProjectDesc('');
            setProjectAdd(false);

            // const timer = setTimeout(() => { //이슈업로드 후 KanBanList불러오기위해 사용
            //     handleUpdate(true);
            // }, 1); // 10초 대기 (10000밀리초)
            // return () => clearTimeout(timer);
        } else
            alert("입력하지 않은 항목이 존재합니다.");
    };

    const handleEditRow = () => {
        //if (projectPart && projectName && projectEndMonth && projectStartMonth && projectUsers && projectState && projectMonths) {
        if (true) {
            const newRow = {
                //id: rows.length ? rows[rows.length - 1].id + 1 : 1, // 새로운 행의 ID 설정
                Project: projectName,
                Part: projectPart,
                StartMonth: projectStartMonth,
                EndMonth: projectEndMonth, // 나이를 숫자로 변환
                Months: projectMonths,
                Users: projectUsers,
                State: projectState,
                Desc: projectDesc,

            };

            setProjectName('');
            setProjectPart('');
            setProjectUsers('');
            setProjectStartMonth('');
            setProjectEndMonth('');
            setProjectEndMonth('');
            setProjectMonths('');
            setProjectState('');
            setProjectDesc('');
            setProjectAdd(false);
            setProjectEdit(false);
        }
    };

    const handleEdit = (row) => {
        console.log('project', row);
        if (projectEdit === true)
        {
            setProjectEdit(false);
            setSelectedRow(null);
        }
        else
            setProjectEdit(true);
    };

    const handleCreate = () => {
        if (projectAdd === true)
            setProjectAdd(false);
        else
            setProjectAdd(true);

    };

    const calculatePercentage = (startDate, endDate) => {
        const ratio = startDate / endDate;
        const percentage = ratio * 100;
        return percentage.toFixed(2);
      };

    return (
        <div className="project-table-container">

<div className="table-counter">
                
                {
                    !projectEdit && (
                        <button className="create-button" onClick={handleCreate}>
                            프로젝트 생성
                            <i>{projectAdd ? '➖' : '➕'}</i>
                        </button>
                    )
                }
            </div>
            {/*Project Insert*/}
            {
                projectAdd && (
                    <div>
                        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                            <TextField
                                label="Project"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                            <TextField
                                label="Part"
                                value={projectPart}
                                onChange={(e) => setProjectPart(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>상태</InputLabel>
                                <Select value={projectState} onChange={(e) => setProjectState(e.target.value)}
                                    label="상태">
                                    <MenuItem value="0">Setup</MenuItem>
                                    <MenuItem value="1">Production Setup</MenuItem>
                                    <MenuItem value="2">Initiation</MenuItem>
                                    <MenuItem value="3">Development</MenuItem>
                                    <MenuItem value="4">Planning</MenuItem>
                                    <MenuItem value="5">Testing</MenuItem>
                                    
                                </Select>
                            </FormControl>
                            <TextField
                                label="투입인원"
                                value={projectUsers}
                                onChange={(e) => setProjectUsers(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>시작</InputLabel>
                                <Select value={projectStartMonth} onChange={(e) => setProjectStartMonth(e.target.value)}
                                    label="시작">
                                    <MenuItem value="0">1월</MenuItem>
                                    <MenuItem value="1">2월</MenuItem>
                                    <MenuItem value="2">3월</MenuItem>
                                    <MenuItem value="3">4월</MenuItem>
                                    <MenuItem value="4">5월</MenuItem>
                                    <MenuItem value="5">6월</MenuItem>
                                    <MenuItem value="5">7월</MenuItem>
                                    <MenuItem value="5">8월</MenuItem>
                                    <MenuItem value="5">9월</MenuItem>
                                    <MenuItem value="5">10월</MenuItem>
                                    <MenuItem value="5">11월</MenuItem>
                                    <MenuItem value="5">12월</MenuItem>
                                    
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>끝</InputLabel>
                                <Select value={projectEndMonth} onChange={(e) => setProjectEndMonth(e.target.value)}
                                    label="끝">
                                    <MenuItem value="0">1월</MenuItem>
                                    <MenuItem value="1">2월</MenuItem>
                                    <MenuItem value="2">3월</MenuItem>
                                    <MenuItem value="3">4월</MenuItem>
                                    <MenuItem value="4">5월</MenuItem>
                                    <MenuItem value="5">6월</MenuItem>
                                    <MenuItem value="5">7월</MenuItem>
                                    <MenuItem value="5">8월</MenuItem>
                                    <MenuItem value="5">9월</MenuItem>
                                    <MenuItem value="5">10월</MenuItem>
                                    <MenuItem value="5">11월</MenuItem>
                                    <MenuItem value="5">12월</MenuItem>
                                    
                                </Select>
                            </FormControl>
                            <TextField
                                label="진행개월수"
                                value={projectMonths}
                                onChange={(e) => setProjectMonths(e.target.value)}
                            />
                            <TextField
                                label="이슈 및 보고"
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleAddRow}>
                                Add
                            </Button>
                        </Box>
                    </div>
                )
            }

            {/*Project Edit*/}
            {
                projectEdit && (
                    <div>
                        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                            <TextField
                                disabled
                                label="Project"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                            <TextField
                                label="Part"
                                value={projectPart}
                                onChange={(e) => setProjectPart(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>상태</InputLabel>
                                <Select value={projectState} onChange={(e) => setProjectState(e.target.value)}
                                    label="상태">
                                    <MenuItem value="0">Setup</MenuItem>
                                    <MenuItem value="1">Production Setup</MenuItem>
                                    <MenuItem value="2">Initiation</MenuItem>
                                    <MenuItem value="3">Development</MenuItem>
                                    <MenuItem value="4">Planning</MenuItem>
                                    <MenuItem value="5">Testing</MenuItem>
                                    
                                </Select>
                            </FormControl>
                            <TextField
                                label="투입인원"
                                value={projectUsers}
                                onChange={(e) => setProjectUsers(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>시작</InputLabel>
                                <Select value={projectStartMonth} onChange={(e) => setProjectStartMonth(e.target.value)}
                                    label="시작">
                                    <MenuItem value="0">1월</MenuItem>
                                    <MenuItem value="1">2월</MenuItem>
                                    <MenuItem value="2">3월</MenuItem>
                                    <MenuItem value="3">4월</MenuItem>
                                    <MenuItem value="4">5월</MenuItem>
                                    <MenuItem value="5">6월</MenuItem>
                                    <MenuItem value="5">7월</MenuItem>
                                    <MenuItem value="5">8월</MenuItem>
                                    <MenuItem value="5">9월</MenuItem>
                                    <MenuItem value="5">10월</MenuItem>
                                    <MenuItem value="5">11월</MenuItem>
                                    <MenuItem value="5">12월</MenuItem>
                                    
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>끝</InputLabel>
                                <Select value={projectEndMonth} onChange={(e) => setProjectEndMonth(e.target.value)}
                                    label="끝">
                                    <MenuItem value="0">1월</MenuItem>
                                    <MenuItem value="1">2월</MenuItem>
                                    <MenuItem value="2">3월</MenuItem>
                                    <MenuItem value="3">4월</MenuItem>
                                    <MenuItem value="4">5월</MenuItem>
                                    <MenuItem value="5">6월</MenuItem>
                                    <MenuItem value="5">7월</MenuItem>
                                    <MenuItem value="5">8월</MenuItem>
                                    <MenuItem value="5">9월</MenuItem>
                                    <MenuItem value="5">10월</MenuItem>
                                    <MenuItem value="5">11월</MenuItem>
                                    <MenuItem value="5">12월</MenuItem>
                                    
                                </Select>
                            </FormControl>
                            <TextField
                                label="진행개월수"
                                value={projectMonths}
                                onChange={(e) => setProjectMonths(e.target.value)}
                            />
                            <TextField
                                label="이슈 및 보고"
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleEditRow}>
                                Edit
                            </Button>
                        </Box>
                    </div>
                )
            }

            <table className="project-table">
                <thead>
                    <tr className="project-table-header">
                        <th className="project-table-header-cell">#</th>
                        <th className="project-table-header-cell">프로젝트명</th>
                        <th className="project-table-header-cell">파트</th>
                        <th className="project-table-header-cell">상태</th>
                        <th className="project-table-header-cell">투입인원</th>
                        <th className="project-table-header-cell">공격/수비</th>
                        <th className="project-table-header-cell">1월</th>
                        <th className="project-table-header-cell">2월</th>
                        <th className="project-table-header-cell">3월</th>
                        <th className="project-table-header-cell">4월</th>
                        <th className="project-table-header-cell">5월</th>
                        <th className="project-table-header-cell">6월</th>
                        <th className="project-table-header-cell">7월</th>
                        <th className="project-table-header-cell">8월</th>
                        <th className="project-table-header-cell">9월</th>
                        <th className="project-table-header-cell">10월</th>
                        <th className="project-table-header-cell">11월</th>
                        <th className="project-table-header-cell">12월</th>
                        <th className="project-table-header-cell">이슈 및 비교</th>
                        <th className="project-table-header-cell">수정</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((row, index) => (
                        <tr key={index} className="project-table-row">
                            <td className="project-table-cell">
                                {row.Index}
                            </td>
                            <td className="project-table-cell">{row.ProjectName}</td>
                            <td className="project-table-cell">{row.Part}</td>
                            <td className="project-table-cell">{row.State}</td>
                            <td className="project-table-cell">{row.Users}</td>
                            <td className="project-table-cell">{row.Months}/{row.EndMonth}</td>
                            <td className="project-table-cell" colSpan={row.EndMonth}>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${row.Progress}%` }}>
                                        {calculatePercentage(row.Months, row.EndMonth)}%
                                    </div>
                                </div>
                            </td>
                            {[...Array(12 - row.EndMonth)].map((_, idx) => (
                                <td key={idx} className="project-table-cell"></td>
                            ))}
                            <td className="project-table-cell">{row.Desc}</td>
                            <td className="project-table-cell">
                                <button
                                        className="edit-button"
                                        onClick={() => handleEdit(row)}
                                    >
                                        수정
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
