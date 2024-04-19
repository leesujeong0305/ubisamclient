import React, { useState, useEffect } from 'react';
import Axios from '../API/AxiosApi';
import { Modal, Button, Form } from 'react-bootstrap';

function Today({ onClose, post, selectedProjectName }) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState('');
    const [memo, setMemo] = useState('');
    const [selectValue, setSelectValue] = useState('');

    const Continents = [ /* 상태 색상 표기 */
        { key: 1, value: '대기', color: '#CCCCFF' },
        { key: 2, value: '진행중', color: '#ADD8E6' },
        { key: 3, value: '완료', color: '#FFD700' },
        { key: 4, value: '이슈', color: '#FFC0CB' },
    ];

    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '-' + month + '-' + day;
    let setDateString = year + '/' + month + '/' + day;

    const handleClose = () => {
        setShow(false);
        onClose();
    }

    const handleShow = () => {
        if (selectedProjectName === 'No Data') {
            alert('프로젝트를 먼저 선택해주세요');
            return;
        }
        setShow(true);
    }

    const handleTaskChange = (e) => setTask(e.target.value);
    const handleMemoChange = (e) => setMemo(e.target.value);

    const handleAdd = () => {
        // Logic to handle adding the task
        setTodoList();
        if (selectValue === '이슈')
            addKanBanList_DB();
        // Reset form and close modal
        setTask('');
        setMemo(setDateString + ' - ');
        setSelectValue('대기');
        handleClose();
    };

    const setTodoList = () => {
        const name = localStorage.getItem('userToken');
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/ToDoList`, {

            ProjectName: selectedProjectName,
            Date: dateString,
            Name: name,
            Title: task,
            Content: memo,
            Status: selectValue,
            FieldIndex: 0
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
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

    const addKanBanList_DB = () => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/addKanBanList`, {
            ProjectName: selectedProjectName,
            Content: task,
            Status: 'issue',
            Order: 0,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
            } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    };

    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
    }

    useEffect(() => {
        setTask(post?.Title);
        setMemo(setDateString + ' - ');
        setSelectValue(post?.value.Status ? post?.value.Status : '대기');
    }, [post]);

    return (
        <>
            <Button style={{backgroundColor: '#5090CC', fontWeight:'bold', borderColor: '#3F72A2' }} onClick={handleShow}>
                <i className="bi bi-plus-square d-flex fs-5 justify-content-center" aria-hidden="true"></i>
            </Button>
            <div>
                <Modal show={show} onHide={handleClose} centered size='lg'>
                    <Modal.Header closeButton >
                        <Modal.Title style={{ color: '#7952B3', fontWeight: 'bold' }}>To Do List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="row">
                                <div className='col-sm-8'>
                                    <Form.Group controlId="formBasicTask">
                                        <Form.Label>제목</Form.Label>
                                        <Form.Control type="text" placeholder="제목을 적어주세요" value={task || ''} onChange={handleTaskChange} />
                                    </Form.Group>
                                </div>
                                <div className='col-sm-4'>
                                    <Form.Group className="mb-3" controlId="formBasicPosition">
                                        <Form.Label>상태 표시</Form.Label>
                                        <Form.Select value={selectValue} onChange={handleSelectChange}>
                                            {Continents.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.value}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>


                            <Form.Group controlId="formBasicMemo" className='mt-2'>
                                <Form.Label>내용</Form.Label>
                                <Form.Control as="textarea" rows={10} placeholder="내용을 적어주세요" value={memo || ''} onChange={handleMemoChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleAdd}>
                            Add
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default Today
