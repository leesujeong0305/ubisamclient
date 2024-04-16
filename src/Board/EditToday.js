import React, { useState, useEffect, useRef } from 'react';
import Axios from '../API/AxiosApi';
import { Modal, Button, Form } from 'react-bootstrap';
import DeleteToday from './DeleteToday';

import './EditToday.css'

function Today({ onClose, post, selectedProjectName }) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState("");
    const [memo, setMemo] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [index, setIndex] = useState('');
    const [oldSelectValue, setOldSelectValue] = useState('');

    // 컴포넌트가 처음 마운트되었는지 추적하기 위한 ref
    const isInitialMount = useRef(true);

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

    const handleClose = () => {
        setShow(false);
        onClose();
    }

    const handleShow = () => {
        if (post === null || post === '') {
            alert('수정할 내용을 먼저 선택해주세요');
            return;
        }

        if (selectedProjectName === 'No Data') {
            alert('프로젝트를 먼저 선택해주세요');
            return;
        }
        setShow(true);
    }

    const handleTaskChange = (e) => setTask(e.target.value);
    const handleMemoChange = (e) => setMemo(e.target.value);

    const handleAdd = async () => {
        const name = localStorage.getItem('userToken');
        if (post.Name !== name) {
            alert('다른 사람의 내용은 수정할수 없습니다');
            return;
        }

        // Logic to handle adding the task
        if (post.Date !== dateString) {
            setEditTodoList(name);
        } else {
            setTodoList(name);
        }
        
        if (selectValue === '이슈')
            await addKanBanList_DB();
        // Reset form and close modal

        if (oldSelectValue === '이슈' && oldSelectValue !== selectValue) {
            await deleteKanBanList_DB();
        }

        setTask('');
        setMemo('');
        post = null;
        handleClose();
    };

    const setTodoList = (name) => {
        const ip = process.env.REACT_APP_API_DEV === 1 ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/UpdateToDoList`, {
            Index: post.Key,
            ProjectName: selectedProjectName,
            ChangeDate: dateString,
            Name: name,
            Title: task,
            Content: memo,
            Status: selectValue,
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

    const setEditTodoList = () => {
        const name = localStorage.getItem('userToken');
        const ip = process.env.REACT_APP_API_DEV === 1 ? `http://localhost:8877` : `http://14.58.108.70:8877`;
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
        const ip = process.env.REACT_APP_API_DEV === 1 ? `http://localhost:8877` : `http://14.58.108.70:8877`;
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

    const deleteKanBanList_DB = async () => {
        const ip = process.env.REACT_APP_API_DEV === 1 ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return await Axios.delete(`${ip}/deleteKanBanList`,{
            data: {
                Project: selectedProjectName,
                Content: task,
            }, 
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
    }

    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
    }

    useEffect(() => {
        setTask(post?.Title);
        setMemo(post?.Content);
        setSelectValue(post?.Status);
        setOldSelectValue(post?.Status);
        setIndex(post?.Index);
    }, [post]);

    return (
        <>
            <Button style={{backgroundColor: '#7952B3', borderColor: '#734EAA', fontSize:'16px'}} onClick={handleShow}>
                <i className="bi bi-pencil-square d-flex fs-5 justify-content-center" aria-hidden="true"></i>
            </Button>
            <div>
                <Modal show={show} onHide={handleClose} centered size='lg'>
                    <Modal.Header closeButton >
                        <Modal.Title style={{ color: '#7952B3', fontWeight: 'bold' }}>To Do Edit</Modal.Title>
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
                                                    {item.value || ''}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="Edit-steps">
                  <div className="Edit-step active">
                    
                    <div className="step-number wan">완</div>
                    <div className="step-content">
                      2024/04/02 - Step 1 Description
                    </div>
                  </div>
                  <div className="Edit-step">
                    <div className="step-number dae">대</div>
                    <div className="step-content">
                      {" "}
                      2024/04/02 - Step 2 Description
                    </div>
                  </div>
                  <div className="Edit-step">
                    <div className="step-number jin">진</div>
                    <div className="step-content">
                      {" "}
                      2024/04/02 - Step 3 Description
                    </div>
                  </div>
            </div>

                            <Form.Group controlId="formBasicMemo" className='mt-2'>
                                <Form.Label>내용</Form.Label>
                                <Form.Control as="textarea" rows={10} placeholder="내용을 적어주세요" value={memo} onChange={handleMemoChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {/*<DeleteToday show={show} type="button" className="btn btn-outline-danger" post={post}>
                            삭제
                        </DeleteToday> */}
                        <Button variant="primary" onClick={handleAdd}>
                            Edit
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
