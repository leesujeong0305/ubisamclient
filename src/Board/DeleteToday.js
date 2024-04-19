import React, { useState, useEffect } from 'react';
import Axios from '../API/AxiosApi';
import { Modal, Button, Form } from 'react-bootstrap';
import './DeleteToday.css'

function DeleteToday({post}) {
    // const [board, setBoard] = useState<Board>({
    //     title: '',
    //     content: ''
    //   });

// Modal
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

useEffect(() => {
  console.log(post);
  //getBoard(match.params.id);
}, []);



const handleDelete = async () => {
    setShow(false);
  //const res = await axios.delete(`/DeleteToDoList?id=${post.Index}`);
  const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  return Axios.delete(`${ip}/DeleteToDoList`, {
            data: {
                Index: post.Index
            
            }, 
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
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
  
}



  return (
    <>
    <Button variant="secondary" onClick={handleShow}>
                삭제
            </Button>
    <Modal show={show} onHide={handleClose} className="modal-center">
        <Modal.Header closeButton>
          <Modal.Title>삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default DeleteToday
