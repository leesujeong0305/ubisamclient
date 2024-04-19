import React, { useState, useLayoutEffect } from 'react'
import {  Dropdown } from 'react-bootstrap';
import { useFooterVisibilityUpdate } from '../Layouts/FooterVisibilityContext';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import Axios from '../API/AxiosApi';
import './Board.css'

import BulletinBoard from './Page/BulletinBoard';
import ProjectStatus from './Status/ProjectStatus';
import MainKanBanBoard from './KanbanBoard/MainKanBanBoard';
import LoadBoard from './Page/LoadBoard';
import UserInfo from '../Models/UserInfo';
import FileExplorer from './ProjectFile/FileExplorer';
import StepIndicator from './Stepbar/StepIndicator';

function Board() {
    //const { authUserId, authUserName, authUserRank } = useSelector(state => state.info);
    const toggleFooterVisibility = useFooterVisibilityUpdate();

    const [selectedActionText, setSelectedActionText] = useState([]);

    const [loadBoard, setLoadBoard] = useState([]);
    const [selectedProjectName, setSelectedProjectName] = useState("No Data");

    const [data, setData] = useState(false);
    const [kanban, setKanban] = useState(false);
    const [period, setPeriod] = useState(false);
    const [status, setStatus] = useState(0);

    const [loading, setLoading] = useState(true);
    const [pm, setPM] = useState('');
    const [selectedTitle, setSelectedTitle] = useState(null);

    const getProjectData = async (name) => {
        //return await LoadBoard(name);
        const loadBoards = await LoadBoard(name);
        const loadSubBoards = await subLoadBoard(name);

        // 각 targetIndex에 맞는 데이터 항목에 상세 정보를 추가하는 함수
        loadSubBoards.forEach(detail => {
            // 해당 targetIndex를 가진 객체를 찾습니다.
            let item = loadBoards.find(item => item.Key === detail.FieldNum);
            if (item) {
                // details 속성이 없다면 초기화합니다.
                if (!item.details) {
                    item.details = [];
                }
                // details 배열에 상세 정보를 추가합니다. targetIndex는 제외합니다.
                item.details.push({
                    Index: detail.Index,
                    ProjectName: detail.ProjectName,
                    Date: detail.Date,
                    ChangeDate: detail.ChangeDate,
                    Name: detail.Name,
                    Title: detail.Title,
                    Content: detail.Content,
                    Status: detail.Status,
                    FieldNum: detail.FieldNum,
                    FieldSubNum: detail.FieldSubNum,
                });
            }
        });
        //console.log('loadBoards', loadBoards);
        return loadBoards;
    }

    const subLoadBoard = async(ProjectName) => {
        const name = localStorage.getItem('userToken');
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return await Axios.get(`${ip}/subLoadBoard?ProjectName=${encodeURIComponent(ProjectName)}&Name=${encodeURIComponent(name)}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            }
        }).then((res) => {
            //console.log('subLoadBoard', { res });
            if (res.data) {
                const dataRow = res.data;
                return dataRow;
            } else if (res.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            console.log({ error });
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    }

    const updatePrjStatus = async (prjName) => {
        const token = localStorage.getItem('userToken');
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        await Axios.post(`${ip}/UpdateUserImpPrj`, {
            projectName: prjName, // 나중에 변경
            userName: token,
        }, {
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            }
        }).then(response => {
            if (response.status === 200) {

            } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            if (error.response.status === 500) {
                alert(`${error.response.data.message}`);
            }
        });
    }

    //pm 별표표시는 내 PC에 있어서 확인 위해 여기만 localhost로 변경하면됨
    const getProject = async (data) => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return await Axios.get(`${ip}/BoardProject?Name=${encodeURIComponent(data)}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            }
        }).then((res) => {
            //console.log('getProject', { res });
            if (res.data) {
                const dataRow = res.data.map((item, index) => ({
                    id: index + 1,
                    text: item.ProjectName,
                    period: item.Period,
                    status: item.Status,
                    pm : item.PM
                }));
                setSelectedActionText(dataRow);
                return dataRow;
            } else if (res.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            console.log({ error });
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    }

    const updatePeriod = async (data) => {
        try {
            return await getProject(data.name);
        } catch (error) {

        }
    }

    const fetchData = async () => {
        try {
            const data = await UserInfo();
            if (data === undefined) return;
            if (!data) throw new Error("No data returned from UserInfo");
            const [periodData, projectData] = await Promise.all([
                updatePeriod(data),
                getProjectData(data.impProject),
            ]);
            // 여기서 data도 함께 반환하여 pickAllFruits에서 사용할 수 있도록 함
            return {
                userInfo: data,
                periodData: periodData,
                projectData: projectData,
            };
        } catch (error) {
            throw new Error(`An error occurred during fetching data: ${error.message}`);
        }
    }

    const allData = async () => {
        try {
            const results = await fetchData();
            if (results === undefined) return 'No Data';
            const user = results.userInfo;
            const selectedProject = results.periodData.find(periodData => periodData.text === user.impProject);
            if (selectedProject) {
                setPM(selectedProject.pm);
                setPeriod(selectedProject.period);
                await setLoadBoard(results.projectData);
                setSelectedProjectName(selectedProject.text);
                setStatus(selectedProject.status);
                return selectedProject;
            }
        } catch (error) {
            console.error('An error occurred in pickAllFruits:', error);
        }
    }

    const handleSelect = async (eventKey) => {
        const selectedProject = selectedActionText.find(project => project.text === eventKey);
        if (selectedProject) {
            await updatePrjStatus(selectedProject.text);
            await allData();
        }
    };

    const handleData = (newData) => {
        setData(newData);
        allData();
        setKanban(true);
    };

    const handleCardClick = (title) => {
        setSelectedTitle(title); // 상태 업데이트
        console.log('선택된 타이틀: ', title);
        // 부모 컴포넌트에서 필요한 추가 동작 수행
      };

    useLayoutEffect(() => {
        allData();
        setLoading(false);
        // 페이지가 마운트될 때 Footer를 숨김
        toggleFooterVisibility(false);
        return () => {
            // 페이지가 언마운트될 때 Footer를 다시 표시
            toggleFooterVisibility(true);
        };
    }, []);

    if (loading) return <div>로딩중</div>;
    return (
        <>
            <div className="my-3 ms-3 me-3">
                <div className='row mb-1'>
                    <div className='col-md-2'>
                        <div className='row-md-6 mb-2'>
                            <Card>
                                <Card.Header className='card bg-info'>프로젝트 명</Card.Header>
                                <div className="d-flex align-items-center">
                                    <Dropdown onSelect={handleSelect} style={{ flexGrow: 1 }}>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="w-100 d-flex justify-content-between align-items-center">
                                            <span className="text-left"> {selectedProjectName}</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100">
                                            {selectedActionText.map((action) => (
                                                <Dropdown.Item key={action.id} eventKey={action.text} className="d-flex align-items-center justify-content-between">
                                                    {action.text}
                                                    {selectedProjectName === action.text ? (
                                                        <span className="text-warning  ms-2 fs-3">★</span> // Star for selected item
                                                    ) : (
                                                        <span className=" ms-2 fs-3">☆</span> // Grey star for unselected items
                                                    )}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Card>
                        </div>
                        <div className='row-md-6'>
                            <Card>
                                <Card.Header className='card bg-success'>프로젝트 기간</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{period}</ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </div>
                        <div className="col mt-2">
                            {/* <StepStepMain /> */}
                            <StepIndicator status={status} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <ProjectStatus boardData={loadBoard} pm={pm} handleCardClick={handleCardClick} />
                    </div>
                    <div className="col-md-3">
                        <MainKanBanBoard projectName={selectedProjectName} kanban={kanban} setKanban={setKanban} />
                    </div>
                    <div className="col-md-3">
                        <FileExplorer selectedProjectName={selectedProjectName} />
                    </div>
                </div>
                <div className='mt-5'>
                    <BulletinBoard boardData={loadBoard} handleData={handleData} selectedProjectName={selectedProjectName} selectedTitle={selectedTitle} />
                </div>
            </div>
        </>
    );
}

export default Board
