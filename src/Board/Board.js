import React, { useState, useEffect, useRef } from 'react'
import { Container, Form, Button, Dropdown } from 'react-bootstrap';
import { useFooterVisibilityUpdate } from '../Layouts/FooterVisibilityContext';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import Axios from '../API/AxiosApi';
//import DeleteToday from './DeleteToday'
import './Board.css'

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment/moment';
import Chart from './Chart';
import BulletinBoard from './Page/BulletinBoard';
import ProjectStatus from './Status/ProjectStatus';


function Board() {
    const { authUserId, authUserName, authUserRank } = useSelector(state => state.info);
    const dispatch = useDispatch();
    
    const toggleFooterVisibility = useFooterVisibilityUpdate();
    const { value, onchange } = useState(new Date());
    const [project, SetProject] = useState([
        {
            Index: 0,
            ProjectName: "Project",
            Period: "",
            Name: ""
        }
    ]);

    const getProject = () => {
        return Axios.post(`http://localhost:8080/BoardProject`, {
            Name: "홍길동", // 나중에 Name으로 변경
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
                const newDataRow = response.data.data.map((item, index) => ({
                    Index: index,
                    ProjectName: item.ProjectName,
                    Data: item.Period,
                    Name: item.Users
                }));
                SetProject(newDataRow); // 상태 업데이트

            } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");

            }
        }).catch(error => {
            //console.log({error});
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    }


    useEffect(() => {
        //getProject();

        // 페이지가 마운트될 때 Footer를 숨김
        toggleFooterVisibility(false);
        return () => {
            // 페이지가 언마운트될 때 Footer를 다시 표시
            toggleFooterVisibility(true);
        };
    }, []);


    return (
        <>
            <Container
                className="my-4"
            >
                <div className='row mb-4'>
                    <div className="col-sm-4">
                        <div className="mb-2">
                            <Card>
                                <Card.Header className='card bg-info'>프로젝트 명</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>프로젝트 ...</ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </div>


                        <div className="mb-2">
                            <Card>
                                <Card.Header className='card bg-success'>프로젝트 기간</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>2024.01.01 ~ ...</ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <Card.Header className='card bg-warning'>프로젝트 인원</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>최이근(pm),</ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </div>
                    </div>
                    <div className="col-lg-5" style={{ textAlign: 'center' }}>
                        <ProjectStatus />
                    </div>
                    

                </div>
                {/* <Link to={'/FullCalendar'}>FullCalendar</Link> */}
                <BulletinBoard />
            </Container>
        </>
    );
}

export default Board
