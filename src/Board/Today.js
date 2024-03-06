import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function Today({onClose}) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState('');
    const [memo, setMemo] = useState('');

    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '-' + month + '-' + day;

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
        return axios.post(`http://localhost:8080/ToDoList`, {

            ProjectName:"First",
            Date: dateString,
            Name: "홍길동",
            Title: task,
            Content: memo,
            Status: "대기",
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

     // 다이얼로그가 닫혔을 때 실행할 로직
  const handleDialogClose = () => {
    console.log('다이얼로그가 닫혔습니다.');
    // 다이얼로그 닫힘 후 필요한 작업 수행, 예를 들어, 데이터를 새로 고침
  };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Show To Do List
            </Button>
            <div>
                <Modal show={show} onHide={handleClose} centered size='lg'>
                    <Modal.Header closeButton >
                        <Modal.Title style={{ color: '#7952B3', fontWeight: 'bold' }}>To Do List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasicTask">
                                <Form.Label>제목</Form.Label>
                                <Form.Control type="text" placeholder="제목을 적어주세요" value={task} onChange={handleTaskChange} />
                            </Form.Group>

                            <Form.Group controlId="formBasicMemo" className='mt-2'>
                                <Form.Label>내용</Form.Label>
                                <Form.Control as="textarea" rows={10} placeholder="내용을 적어주세요" value={memo} onChange={handleMemoChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAdd}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default Today
