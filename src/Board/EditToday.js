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
    const [subRows, setSubRows] = useState([]);

    const Continents = [ /* 상태 색상 표기 */
        { key: 1, value: '대기', color: '#CCCCFF', letter: '대' },
        { key: 2, value: '진행중', color: '#ADD8E6', letter: '진' },
        { key: 3, value: '완료', color: '#FFD700', letter: '완' },
        { key: 4, value: '이슈', color: '#FFC0CB', letter: '이' },
        { key: 5, value: '알림', color: '#E64F5A', letter: '알' },
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

    const handleShow = async () => {
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
            let subNum = 0;
            if (subRows.length > 0) {
                if (subRows[subRows.length - 1].Date !== dateString) {
                    subNum = subRows[subRows.length - 1].FieldSubNum + 1;
                    setSubEdit(name, subNum);
                } else {
                    updateSubEdit(name, subRows[subRows.length - 1]);
                }
                
            } else {
                subNum = 1;
                setSubEdit(name, subNum);
            }
            updateDate(name);
        } else {
            setTodoList(name);
        }

        if (selectValue === '이슈') {
            const loadList = await loadKanBanList_DB();
            console.log('loadList 46', loadList);
            console.log('81', post);
            const result = loadList.some( item => item.Content === post.Title); //같은 요소가 하나라도 있으면 즉시 true 반환함
            console.log('loadList result 48', result);
            if (result) {
                await updataKanBanList_DB();
            } else {
                await addKanBanList_DB();
            }
            
        }
        // Reset form and close modal

        if (oldSelectValue === '이슈' && oldSelectValue !== selectValue) {
            await deleteKanBanList_DB();
        }

        setTask('');
        setMemo('');
        setSubRows([]);
        post = null;
        handleClose();
    };

    const setTodoList = (name) => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
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

    const updateDate = (name) => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/updateDateList`, {
            Index: post.Key,
            ProjectName: selectedProjectName,
            Name: name,
            ChangeDate : dateString,
            Title: task,
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

    const setSubEdit = (name, subNum) => {
        let project = ''
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        const _ProjectName = selectedProjectName.replace(/ /g, '_');
        const index = _ProjectName.indexOf('(');
        if (index !== -1) {
            project = _ProjectName.substring(0, index);
        }
        else project = _ProjectName; // '(' 기호가 없는 경우, 전체 텍스트 반환
        return Axios.post(`${ip}/subAddBoard`, {
            ProjectName: selectedProjectName,
            _ProjectName : project,
            Date: dateString,
            Name: name,
            Title: task,
            Content: memo,
            Status: selectValue,
            FieldNum: post.Key,
            FieldSubNum: subNum,
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

    const updateSubEdit = (name, subRow) => {
        let project = ''
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        const _ProjectName = selectedProjectName.replace(/ /g, '_');
        const index = _ProjectName.indexOf('(');
        if (index !== -1) {
            project = _ProjectName.substring(0, index);
        }
        else project = _ProjectName; // '(' 기호가 없는 경우, 전체 텍스트 반환
        return Axios.post(`${ip}/subUpdateBoard`, {
            Index: subRow.Index,
            ProjectName: selectedProjectName,
            _ProjectName: project,
            ChangeDate: dateString,
            Name: name,
            Title: task,
            Content: memo,
            Status: selectValue,
            FieldNum: subRow.FieldNum,
            FieldSubNum: subRow.FieldSubNum,
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
            Order: post.Key,
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
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return await Axios.delete(`${ip}/deleteKanBanList`, {
            data: {
                Project: selectedProjectName,
                Content: task,
                Order: post.Key,
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

    const loadKanBanList_DB = async () => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return await Axios.get(`${ip}/loadKanBanList?Project=${encodeURIComponent(selectedProjectName)}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            //console.log('getProject', { res });
            if (res.data) {
                //console.log('kanban load', res.data);
                return res.data;
            } else if (res.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            console.log({ error });
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    }

    const updataKanBanList_DB = () => {
        console.log('updataKanBanList 308', task);
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/updataKanBanList`, {
            Project: selectedProjectName,
            OldContent: post.Title,
            Content: task,
            Status: 'issue',
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

    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
    }

    useEffect(() => {
        if (post?.details === undefined) {
            setTask(post?.Title);
            setMemo(post?.Content);
            setSelectValue(post?.Status);
            setOldSelectValue(post?.Status);
            setIndex(post?.Index);
            setSubRows([]);
        } else {
            if (post?.details.length > 0) {
                const {Index, Key, ProjectName, Date, ChangeDate, Name, Title, Content, Status, details} = post;
                const parentRow = { Index, Key, ProjectName, Date, ChangeDate, Name, Title, Content, Status };
                //setSubRows(post);
                setTask(post?.details[post.details.length -1].Title);
                if (post?.details[post.details.length -1].Date === dateString) {
                    setMemo(post?.details[post.details.length -1].Content);
                }
                setSelectValue(post?.details[post.details.length -1].Status);
                setOldSelectValue(post?.details[post.details.length -1].Status);
                setIndex(post?.details[post.details.length -1].Index);
                const newSubRows = [parentRow, ...details.slice(1)];
                setSubRows(newSubRows);
            }
        }
        
    }, [post]);

    return (
        <>
            <Button style={{ backgroundColor: '#7952B3', borderColor: '#734EAA', fontSize: '16px' }} onClick={handleShow}>
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

                            <div className="task-container">
                            {subRows.length > 0 && (
                                <>
                                <div className="task-title"> - 진행 내용 - </div>
                                <div className="group-box">
                                    {subRows.map((step, index) => {
                                        const status = Continents.find(
                                            (status) => status.value === step.Status
                                        );
                                        return (
                                            <React.Fragment key={step.Index}>
                                            <div className="task-step">
                                                
                                                <div
                                                    className="status-circle"
                                                    style={{ backgroundColor: status.color }}
                                                >
                                                    {status.letter}
                                                </div>
                                                <div className="task-description">{`${step.Content}`}</div>
                                            </div>
                                            {index !== subRows.length - 1 && <hr />} {/* 마지막 요소가 아닐 때만 <hr> 추가 */}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                </>
                            )}
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
