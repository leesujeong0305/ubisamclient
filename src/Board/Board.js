import React, { useState, useEffect, useRef } from 'react'
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


function Board() {
    const { authUserId, authUserName, authUserRank } = useSelector(state => state.info);
    const dispatch = useDispatch();

    const toggleFooterVisibility = useFooterVisibilityUpdate();
    const [project, SetProject] = useState([]);

    const getProject = () => {
        const token = localStorage.getItem('userToken');
        return Axios.get(`http://localhost:8080/BoardProject?Name=${encodeURIComponent(token)}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
                // const newDataRow = response.data.data.map((item, index) => ({
                //     Index: index,
                //     ProjectName: item.ProjectName,
                //     Data: item.Period,
                //     Name: item.Users
                // }));
                // SetProject(newDataRow); // 상태 업데이트

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
        

        // 페이지가 마운트될 때 Footer를 숨김
        toggleFooterVisibility(false);
        return () => {
            // 페이지가 언마운트될 때 Footer를 다시 표시
            toggleFooterVisibility(true);
        };
    }, []);

    const handleTest = () => {
        getProject();
    };

    return (
        <>
            <div className="my-4 ms-3 me-3">
                <div className='row mb-1'>
                    <div className='col-md-4'>
                        <div className="row">
                            <div className='col-md-6'>
                                <Card>
                                    <Card.Header className='card bg-info'>프로젝트 명</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>프로젝트 ...</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </div>
                            <div className='col-md-6'>
                                <Card>
                                    <Card.Header className='card bg-success'>프로젝트 기간</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>2024.01.01 ~ ...</ListGroup.Item>
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
                    <BulletinBoard />
                </div>
            </div>
        </>
    );
}

export default Board
