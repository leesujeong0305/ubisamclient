import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Container, Form, Button, Dropdown } from 'react-bootstrap';
import { useFooterVisibilityUpdate } from '../Layouts/FooterVisibilityContext';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import Axios from '../API/AxiosApi';
import './Board.css'

import BulletinBoard from './Page/BulletinBoard';
import ProjectStatus from './Status/ProjectStatus';
import KanBanBoardBody from './KanbanBoard/KanBanBoardBody';
import LoadBoard from './Page/LoadBoard';
import UserInfo from '../Models/UserInfo';


function Board() {
    const { authUserId, authUserName, authUserRank } = useSelector(state => state.info);
    const toggleFooterVisibility = useFooterVisibilityUpdate();

    const [selectedActionText, setSelectedActionText] = useState([]);

    const [loadBoard, setLoadBoard] = useState([]);
    const [selectedProjectName, setSelectedProjectName] = useState("No Data");

    const [data, setData] = useState(false);
    const [period, setPeriod] = useState(false);

    const [trigger, setTrigger] = useState(false); // 강제 업데이트를 위한 상태 dropdown안되서 사용

    // 강제 업데이트 함수
    const forceUpdate = () => {
        setTrigger(t => !t); // 현재 값의 반대값을 설정하여 강제 업데이트
    };

    const getProjectData = async (name) => {
        return await LoadBoard(name);
    }

    const updatePrjStatus = (prjName) => {
        const token = localStorage.getItem('userToken');
        Axios.post(`http://localhost:8080/UpdateUserImpPrj`, {
            projectName: prjName, // 나중에 변경
            userName: token,
        }, {
            headers: {
                "Content-Type": "application/json",
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

    const getProject = async (data) => {
        return await Axios.get(`http://localhost:8080/BoardProject?Name=${encodeURIComponent(data)}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            //console.log('getProject', { res });
            if (res.data) {
                const dataRow = res.data.map((item, index) => ({
                    id: index + 1,
                    text: item.ProjectName,
                    period: item.Period,
                    status: item.Status,
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
            const user = results.userInfo;
            const selectedProject = results.periodData.find(periodData => periodData.text === user.impProject);

            if (selectedProject) {
                console.log("alldata", selectedProject);
                setSelectedProjectName(selectedProject.text);
                setPeriod(selectedProject.period);
                setLoadBoard(results.projectData);
                return selectedProject;
            }
        } catch (error) {
            console.error('An error occurred in pickAllFruits:', error);
        }
    }

    const handleSelect = async (eventKey) => {
        const selectedProject = selectedActionText.find(project => project.text === eventKey);
        if (selectedProject) {
            updatePrjStatus(selectedProject.text);
            allData();
            setSelectedProjectName(selectedProject.text);
        }
        forceUpdate();
    };

    const handleData = (newData) => {
        setData(newData);
    };

    useLayoutEffect(() => {
        allData();
        
        // 페이지가 마운트될 때 Footer를 숨김
        toggleFooterVisibility(false);
        return () => {
            // 페이지가 언마운트될 때 Footer를 다시 표시
            toggleFooterVisibility(true);
        };
    }, []);

    return (
        <>
            <div className="my-4 ms-3 me-3">
                <div className='row mb-1'>
                    <div className='col-md-4'>
                        <div className="row">
                            <div className='col-md-6'>
                                <Card>
                                    <Card.Header className='card bg-info'>프로젝트 명</Card.Header>
                                    <div className="d-flex align-items-center">
                                        <Dropdown onSelect={handleSelect} className="me-2" style={{ flexGrow: 1 }}>
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
                            <div className='col-md-6'>
                                <Card>
                                    <Card.Header className='card bg-success'>프로젝트 기간</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>{period}</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </div>
                        </div>
                        <div>
                            <ProjectStatus />
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <div className="col">
                            <div className=" issue">
                                <KanBanBoardBody />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <BulletinBoard boardData={loadBoard} handleData={handleData} selectedProjectName={selectedProjectName} />
                </div>
            </div>
        </>
    );
}

export default Board
