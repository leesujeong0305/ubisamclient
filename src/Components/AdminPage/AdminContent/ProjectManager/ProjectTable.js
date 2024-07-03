import React, { useEffect, useState } from 'react';
import './ProjectTable.css';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Pagination from '../../../../Board/Page/Pagination';
import { AddProjectInfo } from '../../../../API/AddProjectInfo';

const ProjectTable = ({ projects, site, handleUpdate }) => {
    const [viewStates, setViewStates] = useState(true);//projects.map(() => true));
    const [projectName, setProjectName] = useState("");
    const [projectPeriod, setProjectPeriod] = useState("");
    const [projectUsers, setProjectUsers] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [projectPM, setProjectPM] = useState("");
    const [projectSite, setProjectSite] = useState("");
    const [projectView, setProjectView] = useState("");

    const [projectAdd, setProjectAdd] = useState(false);
    const [projectEdit, setProjectEdit] = useState(false);
    const [update, setUpdate] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const [postsPerPage] = useState(13); // 페이지 당 포스트 수
    const [totalPage, setTotalPage] = useState(0); //전체 Page 수

    // 현재 표시할 포스트 계산
    const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지의 마지막 포스트 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지의 첫 포스트 인덱스
    const currentPosts = projects.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지의 포스트 슬라이스

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호를 받아 현재 페이지 상태를 업데이트

    const handleToggle = (index) => {
        setViewStates(!index);//(prevStates) =>
            //prevStates.map((state, i) => (i === index ? !state : state))
        //);
    };

    const handleEdit = (project) => {
        console.log('project', project);
        if (projectEdit === true)
            setProjectEdit(false);
        else
            setProjectEdit(true);

        setProjectName(project.ProjectName);
        setProjectPeriod(project.Period);
        setProjectUsers(project.Users);
        setProjectStatus(project.Status);
        setProjectPM(project.PM);
        setProjectSite(project.Site);
        setProjectView(project.View);
    };

    const handleCreate = () => {
        if (projectAdd === true)
            setProjectAdd(false);
        else
            setProjectAdd(true);

    };

    const GetStatus = (status) => {
        switch (status) {
            case 0:
                return '대기';
            case 1:
                return '제작';
            case 2:
                return '셋업';
            case 3:
                return '완료';
            default:
                return 'none';
        }
    };

    const handleAddRow = async () => {
        if (projectName && projectPeriod && projectUsers && projectSite) {
            const newRow = {
                //id: rows.length ? rows[rows.length - 1].id + 1 : 1, // 새로운 행의 ID 설정
                Project: projectName,
                Period: projectPeriod, // 나이를 숫자로 변환
                Users: projectUsers,
                Status: projectStatus,
                PM: projectPM,
                Site: projectSite,
                View: projectView,

            };
            //console.log('newRow', newRow);
            await AddProjectInfo(newRow);


            //setRows([...rows, newRow]);
            setProjectName('');
            setProjectPeriod('');
            setProjectUsers('');
            setProjectStatus('');
            setProjectPM('');
            setProjectSite('');
            setProjectAdd(false);

            const timer = setTimeout(() => { //이슈업로드 후 KanBanList불러오기위해 사용
                handleUpdate(true);
            }, 1); // 10초 대기 (10000밀리초)
            return () => clearTimeout(timer);
        } else
            alert("입력하지 않은 항목이 존재합니다.");
    };

    const handleEditRow = () => {
        if (projectName && projectPeriod && projectUsers && projectSite) {
            const newRow = {
                //id: rows.length ? rows[rows.length - 1].id + 1 : 1, // 새로운 행의 ID 설정
                Project: projectName,
                Period: projectPeriod, // 나이를 숫자로 변환
                Users: projectUsers,
                Status: projectStatus,
                PM: projectPM,
                Site: projectSite,
                View: projectView,

            };

            setProjectName('');
            setProjectPeriod('');
            setProjectUsers('');
            setProjectStatus('');
            setProjectPM('');
            setProjectSite('');
            setProjectAdd(false);
            setProjectEdit(false);
        }
    };


    useEffect(() => {
        if (projects) {
            const total = projects.length / postsPerPage;
            setTotalPage(total);
            setProjectSite(site);
        }
    }, [projects])

    return (
        <div className="project-container">
            <div className="table-counter">
                <span>총 프로젝트: {projects.length}</span>
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
                                label="Period"
                                value={projectPeriod}
                                onChange={(e) => setProjectPeriod(e.target.value)}
                            />
                            <TextField
                                label="Users"
                                value={projectUsers}
                                onChange={(e) => setProjectUsers(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>프로젝트 상태</InputLabel>
                                <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}
                                    label="프로젝트 상태">
                                    <MenuItem value="0">대기</MenuItem>
                                    <MenuItem value="1">제작</MenuItem>
                                    <MenuItem value="2">셋업</MenuItem>
                                    <MenuItem value="3">완료</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="PM"
                                value={projectPM}
                                onChange={(e) => setProjectPM(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleAddRow}>
                                Add Row
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
                                label="Period"
                                value={projectPeriod}
                                onChange={(e) => setProjectPeriod(e.target.value)}
                            />
                            <TextField
                                label="Users"
                                value={projectUsers}
                                onChange={(e) => setProjectUsers(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>프로젝트 상태</InputLabel>
                                <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}
                                    label="프로젝트 상태">
                                    <MenuItem value="0">대기</MenuItem>
                                    <MenuItem value="1">제작</MenuItem>
                                    <MenuItem value="2">셋업</MenuItem>
                                    <MenuItem value="3">완료</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="PM"
                                value={projectPM}
                                onChange={(e) => setProjectPM(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>View</InputLabel>
                                <Select value={projectView} onChange={(e) => setProjectView(e.target.value)}
                                    label="프로젝트 상태">
                                    <MenuItem value="0">미사용</MenuItem>
                                    <MenuItem value="1">사용</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" onClick={handleEditRow}>
                                Edit Row
                            </Button>
                        </Box>
                    </div>
                )
            }

            <div className="project-table">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>프로젝트명</th>
                            {/* <th>유형</th> */}
                            <th>PM</th>
                            <th>인원</th>
                            <th>상태</th>
                            <th>기간</th>
                            <th>View</th>
                            <th>수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((project, index) => (
                            <tr key={index}>
                                <td>{project.id}</td>
                                <td>{project.ProjectName}</td>
                                {/* <td>{project.type}</td> */}
                                <td>{project.PM}</td>
                                <td>
                                    <div className="personnel-list">
                                        {/* {project.personnel.join(', ')} */}
                                        {project.Users}
                                    </div>
                                </td>
                                <td>{GetStatus(project.Status)}</td>
                                <td>{project.Period}</td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={project.View}
                                            onChange={() => handleToggle(project.View)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(project)}
                                    >
                                        수정
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