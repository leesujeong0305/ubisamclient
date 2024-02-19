import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import contactUs from "..//db/data.json";
import { BsPencil, BsTrash } from "react-icons/bs";
import { useFooterVisibilityUpdate } from '../Layouts/FooterVisibilityContext';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import axios from 'axios';
import Today from './Today';
import './Board.css'

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment/moment';
import Chart from './Chart';


function Board() {
    // console.log(contactUs);
    const [personnelinfo, setpersonnelinfo] = useState(false);
    const columns = ["#", "이 름", "직 급", "Phone", "내용", "Actions"];
    const [IsDataChange, setIsDataChange] = useState(true);
    const toggleFooterVisibility = useFooterVisibilityUpdate();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { value, onchange } = useState(new Date());

    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '년 ' + month + '월 ' + day + '일 ';
    //setNowDay(dateString);
    // const [NowDay, setNowDay] = useState(dateString);


    useEffect(() => {
        // 페이지가 마운트될 때 Footer를 숨김
        toggleFooterVisibility(false);
        return () => {
            // 페이지가 언마운트될 때 Footer를 다시 표시
            toggleFooterVisibility(true);
        };
    });

    function userPhone(phone) {
        let userPhone = phone.substring(0, 3) + "-" + phone.substring(3, 7) + "-" + phone.substring(7, 11);
        return userPhone;
    }

    function del(data) {
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

    function edit(data) {
        if (window.confirm('수정 하시겠습니까?')) {
            axios.post(`http://localhost:3001/ContactUs`, {
                //writer: props.user.userData._id,
                name: data.Name,
                position: data.Position,
                phone: data.Phone,
                email: data.Email
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            ).then(res => {
                if (res.status >= 200 && res.status < 300) {
                    console.log("수정 성공", res.data);
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
                    <div className="col-sm-4 ms-5">
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

                    <div className="col-sm-3 ms-5" style={{ display: 'flex', justifyContent: 'right' }}>
                        <Calendar value={value} onchange={onchange} formatDay={(locale, date) => moment(date).format("DD")} />
                    </div>
                </div>





                {/* <table className="table table-. "> */}
                <table className="table table-striped table-hover border-primary">
                    <caption className='me-5' style={{ textAlign: 'right' }}>{dateString}</caption>
                    <thead className="text-dark table-info">
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{col}</th>
                                //<th align="center" key={col}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody >
                        {contactUs.ContactUs.map((user, index) => (
                            <tr key={index + 1}>
                                <td input type="checkbox">
                                    {" "}
                                    {index + 1}
                                </td>
                                <td>{user.name}</td>
                                <td>{user.position}</td>
                                <td>{userPhone(user.phone)}</td>
                                <td>{user.email}</td>
                                {/* {IsDataChange &&  <td  className="d-flex gap-2">} */}
                                <td className="gap-2">
                                    {/* <button
                    type="button"
                    className="btn btn-outline-info col-5 btn-sm"
                    disabled={IsDataChange}
                    >
                    <BsPencil />
                  </button> */}
                                    <button onClick={() => edit(user)}
                                        type='button'
                                        className='btn btn-outline-success row-8'
                                        disabled={IsDataChange}
                                    >
                                        <BsPencil />
                                    </button>
                                    <button onClick={() => del(user)}
                                        type="button"
                                        className="btn btn-outline-danger row-8 ms-1"
                                        disabled={IsDataChange}
                                    >
                                        <BsTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <button type="button" class="btn btn-outline-info">Info</button> */}
                {/* <div className="d-grid gap-2 col-6 mx-auto" role="group"> */}
                <div className="d-flex justify-content-center gap-2">
                    <Today show={show} onHide={() => setShow(false)} dialogClassName="custom-modal-size" />
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setIsDataChange(!IsDataChange)}
                    >
                        {IsDataChange ? "수정/삭제" : "진행중 ..."}
                    </button>
                </div>
            </Container>
        </>
    );
}

export default Board
