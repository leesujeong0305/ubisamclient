import React, { useState, useLayoutEffect, useEffect } from 'react'
import { Dropdown } from 'react-bootstrap';
import { useFooterVisibilityUpdate } from '../Layouts/FooterVisibilityContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../Redux/Store';
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
import Scrolling from '../Components/ScrollingSignboard/Scrolling';
import ViewGitHistory from '../Components/GitHistory/ViewGitHistory';
import GetUserInfo from '../API/GetUserInfo';
import GetSubLoadBoard from '../API/GetSubLoadBoard';
import { GetProject } from '../API/GetProject';

function Board() {
    const isLogged = useSelector(state => state.auth.isLoggedIn);
    const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector((state) => state.userInfo);
    const toggleFooterVisibility = useFooterVisibilityUpdate();

    const [selectedActionText, setSelectedActionText] = useState([]);

    const [loadBoard, setLoadBoard] = useState([]);
    const [selectedProjectName, setSelectedProjectName] = useState("No Data");

    const [data, setData] = useState(false);
    //const [kanban, setKanban] = useState(false);
    const [period, setPeriod] = useState(false);
    const [status, setStatus] = useState(0);

    const [loading, setLoading] = useState(true);
    const [pm, setPM] = useState('');
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [warningBoard, setWarningBoard] = useState([]);
    const [category, SetCategory] = useState('');

    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '-' + month + '-' + day;


    const Continents = [
        { key: '자동화1팀', value: '파주' },
        { key: '시스템사업팀', value: '구미' },
        { key: '장비사업팀', value: '서울' },
        { key: 'ReadOnly', value: '파주' },
    ];

    const selectSite = () => {
        if (authUserTeam === undefined) return;
        const found = Continents.find((item) => item.key === authUserTeam);
        return found ? found.value : undefined;
    };

    // const setSubEdit = async (name, sub, subNum) => {
    //     let project = ''
    //     const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    //     const _ProjectName = sub.ProjectName.replace(/ /g, '_');
    //     const index = _ProjectName.indexOf('(');
    //     if (index !== -1) {
    //         project = _ProjectName.substring(0, index);
    //     }
    //     else project = _ProjectName; // '(' 기호가 없는 경우, 전체 텍스트 반환
    //     return await Axios.post(`${ip}/subAddBoard`, {
    //         ProjectName: sub.ProjectName,
    //         _ProjectName: project,
    //         Date: dateString,
    //         Name: name,
    //         Title: sub.Title,
    //         Content: sub.Content,
    //         Status: '알림',
    //         FieldNum: sub.Index,
    //         FieldSubNum: subNum,
    //     }, {
    //         headers: {
    //             "Content-Type": "application/json",
    //         }
    //     }).then(response => {
    //         console.log({ response });
    //         if (response.status === 200) {
    //         } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
    //             console.log("403");

    //         }
    //     }).catch(error => {
    //         //console.log({error});
    //         if (error.response.status === 403) {
    //             alert(`${error.response.data.message}`);
    //         }
    //     });
    // }

    const getProjectData = async (name) => {
        //return await LoadBoard(name);
        if (name === null || name === undefined) {
            return undefined;
        }
            
        const loadBoards = await LoadBoard(name);
        //const loadSubBoards = await subLoadBoard(name);
        const loadSubBoards = await GetSubLoadBoard(name);
        
        if (loadSubBoards === undefined) {
            return loadBoards;
        }

        // 각 targetIndex에 맞는 데이터 항목에 상세 정보를 추가하는 함수
        loadSubBoards.forEach(detail => {
            // 해당 targetIndex를 가진 객체를 찾습니다.
            let item = loadBoards.find(item => item.Key === detail.FieldNum);
            if (item) {
                // details 속성이 없다면 초기화합니다.
                if (!item.details) {
                    item.details = [JSON.parse(JSON.stringify(item))]; //status 업데이트를 위해 복사해서 초기화함
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
                //item.details[0].Status = item.details[item.details.length - 1].Status;
            }
        });
        //console.log('loadBoards', loadBoards);
        return loadBoards;
    }

    const updatePrjStatus = async (prjName) => {
        const token = localStorage.getItem('userToken');
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        //const ip = `http://localhost:8877`;
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

    const updatePeriod = async (data) => {
        //try {
            //return await getProject(data.name);
            if (authUserId !== '' && authManager !== '' ) {
                const site = selectSite();
                //console.log('데이터 정상?', data.name, authUserId, authManager);
                const project = await GetProject(data.name, authUserId, authManager, site);
                //console.log('project', project);
                setSelectedActionText(project);
                SetCategory(project.category);
                return project;
            }
        // } catch (error) {
        // }
    }

    const fetchData = async () => {
        try {
            const data = await GetUserInfo();
            if (data === undefined) return;
            if (!data) throw new Error("No data returned from UserInfo");
            //dispatch(updateUser(data));
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
        const token = localStorage.getItem('userToken');
        let alertTitles = [];
        try {
            const results = await fetchData();
            if (results === undefined) return "No Data";
            if (results.periodData === undefined) return "No Data";
            if (results.projectData === undefined) return undefined;

            // 여기에 추가
            const today = new Date(); // 기준 날짜는 오늘로 설정
            results.projectData = results.projectData.map((item) => {
                const itemDate = new Date(item.Date);
                const diffTime = Math.abs(today - itemDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일 단위로 차이를 계산


                // item.details 배열이 존재하는지 확인 후 모든 항목의 Status를 확인
                const setDay = parseInt(item.Period.replace(/[^0-9]/g, ''), 10);
                const detailsStatuses = item.details ? item.details.map(detail => detail.Status) : [];

                const difference = diffDays - setDay;
                //console.log('itemDate', item.Title, itemDate);
                //console.log('difference 계산 ', difference, diffDays, setDay);
                // 15일 이상 차이가 나고 Status가 '완료' 및 '이슈'가 아닌 경우 '알림'으로 변경

                if (item.details) {
                    if (item.details[item.details.length - 1].Status === '완료') {
                        item.Period = '👍';
                    } else if (item.details[item.details.length - 1].Status === '이슈') {
                        item.Period = '🚨';
                    }
                    else {
                        if (difference > 0) {
                            item.Period = `D+${Math.abs(difference)}`;
                        } else if (difference < 0) {
                            item.Period = `${Math.abs(difference)}일`;
                        } else {
                            item.Period = `D-Day`;
                        }
                    }
                } else {
                    if (item.Status === '완료') {
                        item.Period = '👍';
                    } else if (item.Status === '이슈') {
                        item.Period = '🚨';
                    } else {
                        if (difference > 0) {
                            item.Period = `D+${Math.abs(difference)}`;
                        } else if (difference < 0) {
                            item.Period = `${Math.abs(difference)}일`;
                        } else {
                            item.Period = `D-Day`;
                        }
                    }

                }

                if (
                    diffDays > setDay &&
                    item.Status !== "완료" &&
                    item.Status !== "이슈" &&
                    detailsStatuses.every(
                        (status) => status !== "완료" && status !== "이슈"
                    )
                    // 15일 이상 차이가 나고 Status가 '완료' 및 '이슈'가 아닌 경우 '이슈'로 변경
                ) {
                    if (item.details)
                        item.details[item.details.length - 1].Status = "알림";
                    else
                        item.Status = "알림";
                    alertTitles.push({ title: item.Title, key: item.Key }); // 제목과 키를 alertTitles 배열에 추가
                }
                return item;
            });
            // console.log("Updated Project Data:", results.projectData);

            const user = results.userInfo;
            const selectedProject = results.periodData.find(
                
                (periodData) => periodData.text === user.impProject
            );
            if (selectedProject) {
                //console.log('selectedProject', selectedProject);
                setPM(selectedProject.pm);
                setPeriod(selectedProject.period);
                await setLoadBoard(results.projectData);
                setSelectedProjectName(selectedProject.text);
                setStatus(selectedProject.status);
                setWarningBoard(results.projectData.filter((item) =>  ((item.details && item.details[item.details.length - 1].Status === "알림") || item.Status === "알림")));
                return selectedProject;
            }
        } catch (error) {
            console.error('An error occurred in pickAllFruits:', error);
        }
    }

    const handleSelect = async (eventKey) => {
        const selectedProject = selectedActionText.find(project => project.text === eventKey);
        console.log(selectedProject);
        if (selectedProject) {
            await updatePrjStatus(selectedProject.text);
            await allData();
        }
    };

    const handleData = (newData) => {
        setData(newData);
        allData();
    };

    const handleCardClick = (title) => {
        setSelectedTitle(title); // 상태 업데이트
        // 부모 컴포넌트에서 필요한 추가 동작 수행
    };

    // useLayoutEffect(() => {
    //     allData();
    //     setLoading(false);
    //     // 페이지가 마운트될 때 Footer를 숨김
    //     toggleFooterVisibility(false);
    //     return () => {
    //         // 페이지가 언마운트될 때 Footer를 다시 표시
    //         toggleFooterVisibility(true);
    //     };
    // }, []);

    useEffect(() => {
        if (authUserId !== undefined && authManager !== undefined && authUserId !== null && authManager !== null)
        allData();
        setLoading(false);
        // 페이지가 마운트될 때 Footer를 숨김
        toggleFooterVisibility(false);
        return () => {
            // 페이지가 언마운트될 때 Footer를 다시 표시
            toggleFooterVisibility(true);
        };
    }, [isLogged, authUserId, authManager])

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
                                    <Dropdown onSelect={handleSelect} style={{ flexGrow: 1, width: '100%' }}>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="w-100 d-flex justify-content-between align-items-center">
                                            <span className="text-left"> {selectedProjectName}</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100 dropdown-style">
                                            {selectedActionText.map((action) => (
                                                <Dropdown.Item key={action.id} eventKey={action.text} className="d-flex align-items-center justify-content-between">
                                                    {action.text}
                                                    {selectedProjectName === action.text ? (
                                                        <span className="text-warning ms-2 fs-5">★</span> // Star for selected item
                                                    ) : (
                                                        <span className=" ms-2 fs-5">☆</span> // Grey star for unselected items
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
                            <StepIndicator status={status} selectedProjectName={selectedProjectName} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <ProjectStatus boardData={loadBoard} pm={pm} handleCardClick={handleCardClick} />
                    </div>
                    <div className="col-md">
                        <ViewGitHistory selectedProjectName={selectedProjectName} />
                    </div>
                    <div className="col-md-3">
                        <FileExplorer selectedProjectName={selectedProjectName} />
                    </div>
                </div>
                <div className='mt-4'>
                    <Scrolling selectedProjectName={selectedProjectName} warningboard={warningBoard} />
                </div>

                <div className='mt-4'>
                    <BulletinBoard boardData={loadBoard} handleData={handleData} selectedProjectName={selectedProjectName} selectedTitle={selectedTitle} category={category} />
                </div>
            </div>
        </>
    );
}

export default Board
