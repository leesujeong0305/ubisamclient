import React, { useState, useEffect } from 'react';
import Axios from '../API/AxiosApi';
import { Modal, Button, Form } from 'react-bootstrap';
import './EditToday.css'
import GetUserInfo from '../API/GetUserInfo';

function Today({ onClose, post, selectedProjectName }) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState("");
    const [memo, setMemo] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [index, setIndex] = useState('');
    const [oldSelectValue, setOldSelectValue] = useState('');
    const [subRows, setSubRows] = useState([]);
    const [requester, setRequester] = useState('');
    const [reqManager, setReqManager] = useState('');

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
    let setDateString = year + "/" + month + "/" + day;

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

        let setToday = new Date();
        let setYear = setToday.getFullYear();
        let setMonth = ('0' + (setToday.getMonth() + 1)).slice(-2);
        let setDay = ('0' + setToday.getDate()).slice(-2);
        let date = setYear + '-' + setMonth + '-' + setDay;

        // Logic to handle adding the task
        if (post.Date !== date) {
            let subNum = 0;
            if (subRows.length > 0) {
                if (subRows[subRows.length - 1].Date !== date) {
                    subNum = subRows[subRows.length - 1].FieldSubNum + 1;
                    setSubEdit(name, subNum, date);
                } else {
                    updateSubEdit(name, subRows[subRows.length - 1], date);
                }
                
            } else {
                subNum = 1;
                setSubEdit(name, subNum, date);
            }
            updateDate(name, date);
        } else {
            setTodoList(name, date);
        }

        if (selectValue === '이슈') {
            const loadList = await loadKanBanList_DB();
            const result = loadList.some( item => item.Content === post.Title); //같은 요소가 하나라도 있으면 즉시 true 반환함
            if (result) {
                await updataKanBanList_DB(post.Key);
            } else {
                await addKanBanList_DB(post.Key);
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

    const setTodoList = (name, date) => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/UpdateToDoList`, {
            Index: post.Key,
            ProjectName: selectedProjectName,
            ChangeDate: date,
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

    const updateDate = (name, date) => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/updateDateList`, {
            Index: post.Key,
            ProjectName: selectedProjectName,
            Name: name,
            ChangeDate: date,
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

    const setSubEdit = (name, subNum, date) => {
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
            _ProjectName: project,
            Date: date,
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

    const updateSubEdit = (name, subRow, date) => {
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
            ChangeDate: date,
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
                Content: post.Title,
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

    const updataKanBanList_DB = (item) => {
        console.log('updataKanBanList 308', task, item);
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        //const ip = `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/updataKanBanList`, {
            Project: selectedProjectName,
            OldContent: post.Title,
            Index: item,
            Content: task,
            
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
                return response.data;
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

    const dateReplace = (item) => {
        const text = item
        .replace('YYYY', year)
        .replace('MM', month.toString().padStart(2, '0'))
        .replace('DD', day.toString().padStart(2, '0'));
        return text;
    }

    useEffect(() => {
        let getDateString = '';
        const setCustom = async () => {
            
            const user = await GetUserInfo();
            if (user.custom !== null) {
                const custom = await dateReplace(user.custom);
                getDateString = custom;
            } else {
                getDateString = setDateString + " - ";
            }
            setTodoList();
        };

        const setTodoList = async () => {
        console.log('확인 360', post?.Date, dateString);
        if (post?.Date === dateString && post?.details === undefined) {
            setTask(post?.Title);
            setMemo(post?.Content);
            setSelectValue(post?.Status);
            setOldSelectValue(post?.Status);
            setIndex(post?.Index);
            setRequester(post?.Requester);
            setReqManager(post?.ReqManager);
            setSubRows([]);
            console.log('들어옴 확인' );
        } else {
            console.log('들어옴?' );
            if (post?.details?.length > 0) {
                
                const { Index, Key, ProjectName, Date, ChangeDate, Name, Title, Content, Status, Period, Requester, ReqManager, details } = post;
                const parentRow = { Index, Key, ProjectName, Date, ChangeDate, Name, Title, Content, Status, Period, Requester, ReqManager };
                //setSubRows(post);
                setTask(post?.details[post.details.length - 1].Title);
                if (post?.details[post.details.length - 1].Date === dateString) {
                    setMemo(post?.details[post.details.length - 1].Content);
                } else {
                    setMemo(getDateString);
                }
                setSelectValue(post?.details[post.details.length - 1].Status);
                setOldSelectValue(post?.details[post.details.length - 1].Status);
                setIndex(post?.details[post.details.length - 1].Index);
                const newSubRows = [parentRow, ...details.slice(1)];
                setSubRows(newSubRows);

                setRequester(post?.Requester);
                setReqManager(post?.ReqManager);
            } else { //detail 없고 다른 날짜
                const { Index, Key, ProjectName, Date, ChangeDate, Name, Title, Content, Status, Period, Requester, ReqManager } = post;
                const parentRow = { Index, Key, ProjectName, Date, ChangeDate, Name, Title, Content, Status, Period, Requester, ReqManager };

                setTask(post?.Title);
                if (post?.Date === dateString) {
                    setMemo(post?.Content);
                } else {
                    setMemo(getDateString);
                }
                
                setSelectValue(post?.Status);
                setOldSelectValue(post?.Status);
                setIndex(post?.Index);
                setSubRows([parentRow]);
                setRequester(post?.Requester);
                setReqManager(post?.ReqManager);
                
            }
        }
    }

        if (show) {
            setCustom();
            
        }
        
    }, [post, show]);

    return (
        <>
            <Button
                className="custom-button"
                style={{ backgroundColor: '#7952B3', borderColor: '#734EAA', display: "flex" }}
                onClick={handleShow}
            >
                <i className="bi bi-pencil-square d-flex fs-5 justify-content-center" aria-hidden="true" />
                <div className="separator"></div>
                <span className="button-text">EDIT</span>
                <div className="tooltip-text">TodoList 내용 수정</div>
            </Button>
            <div>
                <Modal show={show} onHide={handleClose} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "#7952B3", fontWeight: "bold", display: "flex" }}>
                            To Do Edit
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form style={{ textAlign: "left" }}>
                            <div className="row">
                                <div className='col-sm-12'>
                                    <Form.Group controlId="formBasicTask">
                                        <Form.Label>제목</Form.Label>
                                        <Form.Control type="text" placeholder="제목을 적어주세요" value={task || ''} onChange={handleTaskChange} />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <Form.Group controlId="formBasicPosition">
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
                                <div className='col-sm-4'>
                                    <Form.Group controlId="formBasicPosition">
                                        <Form.Label>요청자</Form.Label>
                                        <Form.Control type="text" value={requester || ''} readOnly />
                                    </Form.Group>
                                </div>
                                <div className='col-sm-4'>
                                    <Form.Group controlId="formBasicPosition">
                                        <Form.Label>요청 담당자</Form.Label>
                                        <Form.Control type="text" value={reqManager || ''} readOnly />
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
                                                        {index !== subRows.length - 1 && <hr />}{" "}
                                                        {/* 마지막 요소가 아닐 때만 <hr> 추가 */}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>

                            <Form.Group controlId="formBasicMemo" className="mt-2">
                                <Form.Label>내용</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={10}
                                    placeholder="내용을 적어주세요"
                                    value={memo}
                                    onChange={handleMemoChange}
                                />
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
