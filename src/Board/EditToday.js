import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import DeleteToday from './DeleteToday';

function Today({ onClose, post }) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState('');
    const [memo, setMemo] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [index, setIndex] = useState('');

    const Continents = [ /* 상태 색상 표기 */
        { key: 1, value: '대기', color: '#ADD8E6' },
        { key: 2, value: '진행중', color: '#FFD700' },
        { key: 3, value: '완료', color: '#90EE90' },
        { key: 4, value: '이슈', color: '#FFC0CB' },
    ];

    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '-' + month + '-' + day;

    const content = [{
        ProjectName: "First",
        Date: dateString,
        Name: "홍길동",
        Title: task,
        Content: memo,
        Status: "",
    }]

    const handleClose = () => {
        setShow(false);
        console.log("today close");
        onClose();
    }

    const handleShow = () => setShow(true);

    const handleTaskChange = (e) => setTask(e.target.value);
    const handleMemoChange = (e) => setMemo(e.target.value);

    const handleAdd = () => {
        // Logic to handle adding the task
        console.log('Task:', task, 'Memo:', memo);
        setTodoList();
        // Reset form and close modal
        setTask('');
        setMemo('');
        handleClose();
    };

    const setTodoList = () => {
        return axios.post(`http://localhost:8080/UpdateToDoList`, {
            Index: index,
            ProjectName: "First",
            //Date: dateString,
            //Name: "홍길동",
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
                console.log(response.data);
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

    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
    }

    useEffect(() => {
        console.log("aaa", post);
        setTask(post?.Title);
        setMemo(post?.Content);
        setSelectValue(post?.Status);
        setIndex(post?.Index);
    }, [post]);

    return (
        <>
            <Button variant="secondary" onClick={handleShow}>
                수정
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
                                        <Form.Control type="text" placeholder="제목을 적어주세요" value={task} onChange={handleTaskChange} />
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
                                <Form.Control as="textarea" rows={10} placeholder="내용을 적어주세요" value={memo} onChange={handleMemoChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {/*<DeleteToday show={show} type="button" className="btn btn-outline-danger" post={post}>
                            삭제
                        </DeleteToday> */}
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAdd}>
                            Edit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default Today
