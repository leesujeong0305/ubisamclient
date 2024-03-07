import React, { useState, useEffect, useRef } from 'react'
import { Container, Form, Button, Dropdown } from 'react-bootstrap';
import contactUs from "..//db/data.json";
import { BsPencil, BsTrash } from "react-icons/bs";
import { useFooterVisibilityUpdate } from '../Layouts/FooterVisibilityContext';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import axios from 'axios';
import Today from './Today';
import EditToday from './EditToday';
//import DeleteToday from './DeleteToday'
import './Board.css'

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment/moment';
import Chart from './Chart';


function Board() {
    // console.log(contactUs);
    const [personnelinfo, setpersonnelinfo] = useState(false);
    const columns = [
        { name: "#", width: "5%" },
        { name: "날짜", width: "10%" },
        { name: "이 름", width: "10%" },
        { name: "Title", width: "20%" },
        { name: "To Do List", width: "40%" },
        { name: "상태", width: "10%" },];
    const [IsDataChange, setIsDataChange] = useState(true);
    const toggleFooterVisibility = useFooterVisibilityUpdate();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { value, onchange } = useState(new Date());


    const items = [ /* 상태 색상 표기 */
        { id: '대기', color: '#CACACA' }, //#ADD8E6
        { id: '진행중', color: '#FFD700' },
        { id: '완료', color: '#90EE90' },
        { id: '이슈', color: '#FFC0CB' },
    ];


    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '년 ' + month + '월 ' + day + '일 ';
    //setNowDay(dateString);
    // const [NowDay, setNowDay] = useState(dateString);


    // 상태에 따른 색상을 찾는 함수
    const findColorById = (id) => {
        const item = items.find(item => item.id === id);
        return item ? item.color : 'white'; // 해당 상태가 없으면 투명색 반환
    };

    const [project, SetProject] = useState([
        {
            Index: 0,
            ProjectName: "Project",
            Period: "",
            Name: ""
        }
    ])

    const [dataRow, setDataRow] = useState([
        {
            Index: 0,
            ProjectName: "Project",
            Date: dateString,
            Name: "",
            Title: "",
            Content: "",
            Status: ""
        },
    ])

    const selectedPostRef = useRef(null); // 선택된 게시글 데이터를 저장할 ref
    const [selectvalue, setSelectvalue] = useState(null);


    const getProject = () => {
        return axios.post(`http://localhost:8080/BoardProject`, {
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


    const getBoardData = () => {
        return axios.post(`http://localhost:8080/Board`, {
            projectName: "First", // 나중에 변경
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
                const newDataRow = response.data.data.map((item, index) => ({
                    Index: item.Index, // 예시로 index 사용, 실제 구현에서는 서버로부터의 데이터에 따라 조정
                    ProjectName: item.ProjectName, // 서버로부터 받은 데이터 구조에 따라 접근
                    Date: item.Date, // 예시 날짜, 실제로는 동적으로 설정
                    Name: item.Name, // 서버로부터 받은 데이터 구조에 따라 접근
                    Title: item.Title, // 서버로부터 받은 데이터 구조에 따라 접근
                    Content: item.Content, // 서버로부터 받은 데이터 구조에 따라 접근
                    Status: item.Status // 서버로부터 받은 데이터 구조에 따라 접근
                }));
                setDataRow(newDataRow); // 상태 업데이트

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
        getProject();
        getBoardData();

        // 페이지가 마운트될 때 Footer를 숨김
        toggleFooterVisibility(false);
        return () => {
            // 페이지가 언마운트될 때 Footer를 다시 표시
            toggleFooterVisibility(true);
        };
    }, []);

    // 다이얼로그가 닫혔을 때 실행할 로직
    const handleDialogClose = () => {
        // 다이얼로그 닫힘 후 필요한 작업 수행, 예를 들어, 데이터를 새로 고침
        getBoardData();
    };

    const handleRowClick = (row) => {
        console.log('클릭된 행의 데이터:', row);
        setSelectvalue(row);
        selectedPostRef.current = row; // 선택된 게시글 데이터를 ref에 저장
    }

    const del = (data) => {
        if (window.confirm('삭제 하시겠습니까?')) {
            // console.log(data.id);
            axios.delete(`http://localhost:3001/ContactUs/${data.id}`
            ).then(res => {
                if (res.status >= 200 && res.status < 300) {
                    console.log("삭제 성공", res.data);
                }
                else {
                    throw new Error('400 아니면 500 에러남');
                }
            })
                .catch((error) => {
                    console.log("error 발생", error.message);
                });
        }
    }

    return (
        <>

            <Container
                className="my-4"
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div className='row mb-4'>
                    <div className="col-sm-4 me-5">
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
                    <div className="col-sm-3 ms-5" style={{ textAlign: 'center' }}>
                        <Chart />
                    </div>

                    <div className="col-sm-4 ms-2" style={{ display: 'flex', justifyContent: 'right' }} >
                        <Calendar value={value} onchange={onchange} formatDay={(locale, date) => moment(date).format("DD")} />
                    </div>

                </div>


                {/* <table className="table table-. "> */}
                <table className="table table-striped table-hover border-primary table-fixed">
                    <caption className='me-5' style={{ textAlign: 'right' }}>{dateString}</caption>
                    <thead className="text-dark table-info">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} style={{ width: col.width }}>{col.name}</th>
                                //<th align="center" key={col}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRow.map((row, index) => (
                            <tr key={index + 1} onClick={() => handleRowClick(row)}>
                                <td type="checkbox">
                                    {" "}
                                    {index + 1}
                                </td>
                                <td>{row.Date}</td>
                                <td>{row.Name}</td>
                                <td>{row.Title}</td>
                                <td>{row.Content}</td>
                                <td>
                                    <div style={{ backgroundColor: findColorById(`${row.Status}`) }}>{row.Status}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <button type="button" class="btn btn-outline-info">Info</button> */}
                {/* <div className="d-grid gap-2 col-6 mx-auto" role="group"> */}
                <div className="d-flex justify-content-center gap-2">
                    <Today show={show} onHide={() => setShow(false)} onClose={handleDialogClose} post={null} dialogClassName="custom-modal-size" />
                    <EditToday show={show} onHide={() => setShow(false)} onClose={handleDialogClose} post={selectvalue} dialogClassName="custom-modal-size" />
                </div>
            </Container>
        </>
    );
}

export default Board
