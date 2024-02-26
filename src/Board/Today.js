import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function Today() {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState('');
    const [memo, setMemo] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleTaskChange = (e) => setTask(e.target.value);
    const handleMemoChange = (e) => setMemo(e.target.value);

    const handleAdd = () => {
        // Logic to handle adding the task
        console.log('Task:', task, 'Memo:', memo);
        // Reset form and close modal
        setTask('');
        setMemo('');
        handleClose();
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
