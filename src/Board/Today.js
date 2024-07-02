import React, { useState, useEffect } from "react";
import Axios from "../API/AxiosApi";
import { Modal, Button, Form } from "react-bootstrap";
import { GetIndex } from "../API/GetIndex";
import GetUserInfo from "../API/GetUserInfo";

function Today({ onClose, post, selectedProjectName }) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState('');
    const [memo, setMemo] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState("1일");
    const [requester, setrequester] = useState('');
    const [reqManager, setReqManager] = useState('');

    const Continents = [
        /* 상태 색상 표기 */ 
        { key: 1, value: "대기", color: "#CCCCFF" },
        { key: 2, value: "진행중", color: "#ADD8E6" },
        { key: 3, value: "완료", color: "#FFD700" },
        { key: 4, value: "이슈", color: "#FFC0CB" },
        { key: 5, value: "알림", color: "#E64F5A" },
    ];

    const periodOptions = [
        "1일",
        "2일",
        "3일",
        "4일",
        "5일",
        "6일",
        "7일",
        "8일",
        "9일",
        "10일",
        "11일",
        "12일",
        "13일",
        "14일",
        "15일",
    ];

    let today = new Date();
    let year = today.getFullYear();
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let day = ("0" + today.getDate()).slice(-2);
    let dateString = year + "-" + month + "-" + day;
    let setDateString = year + "/" + month + "/" + day;

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    const handleShow = () => {
        if (selectedProjectName === "No Data") {
            alert("프로젝트를 먼저 선택해주세요");
            return;
        }
        setShow(true);
    };

    const handleTaskChange = (e) => setTask(e.target.value);
    const handleMemoChange = (e) => setMemo(e.target.value);
    const handlerequesterChange = (e) => setrequester(e.target.value);
    const handlereqManagerChange = (e) => setReqManager(e.target.value);

    const handleAdd = async () => {
        // Logic to handle adding the task
        const data = await setTodoList();
        //console.log('add data',data);

        if (selectValue === '이슈') {
            let index = null;
            setTimeout(async () => {
                index = await GetIndex(data.data);
                await addKanBanList_DB(index.data.Index);
            }, 500); // 2초 지연
        }
        // Reset form and close modal
        setTask('');
        setMemo(setDateString + ' - ');
        setSelectValue('대기');
        setSelectedPeriod('1일');
        setrequester('');
        setReqManager('');
        handleClose();
    };

    const setTodoList = () => {
        const name = localStorage.getItem('userToken');
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(`${ip}/ToDoList`, {
            ProjectName: selectedProjectName,
            Date: dateString,
            Period: selectedPeriod,
            Requester: requester,
            ReqManager: reqManager,
            Name: name,
            Title: task,
            Content: memo,
            Status: selectValue,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            //console.log({ response });
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

    const addKanBanList_DB = (index) => {
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        return Axios.post(
            `${ip}/addKanBanList`,
            {
                ProjectName: selectedProjectName,
                Content: task,
                Status: "issue",
                Order: index,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => {
                console.log({ response });
                if (response.status === 200) {
                } else if (response.data.code === 403) {
                    //에러메세지 로그 없이 처리하려할때
                    console.log("403");
                }
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    alert(`${error.response.data.message}`);
                }
            });
    };

    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
    };

    const handleSelectPeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const dateReplace = (item) => {
        const text = item
        .replace('YYYY', year)
        .replace('MM', month.toString().padStart(2, '0'))
        .replace('DD', day.toString().padStart(2, '0'));
        return text;
    }

    useEffect(() => {
        const setTodoList = async () => {
            const user = await GetUserInfo();
            if (user.custom !== null) {
                const custom = await dateReplace(user.custom);
                await setMemo(custom);
            } else {
                await setMemo(setDateString + " - ");
            }
            setTask(post?.Title);
            setSelectValue(post?.value.Status ? post?.value.Status : "대기");
        }
        

        if (show) {
            setTodoList();
        }
        
    }, [show]);

    return (
        <>
            <Button
                className="custom-button"
                style={{ backgroundColor: "#5090CC",borderColor: "#3F72A2", display: "flex" }}
                onClick={handleShow}
            >
                <i className="bi bi-plus-square d-flex fs-5 justify-content-center" aria-hidden="true" />
                <div className="separator"></div>
                <span className="button-text">추가</span>
                <div className="tooltip-text">TodoList 내용 추가</div>
            </Button>
            <div>
                <Modal show={show} onHide={handleClose} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "#7952B3", fontWeight: "bold" }}>
                            To Do List
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form style={{textAlign:"left"}}>
                            <div className="row">
                                <div className="col-sm-12">
                                    <Form.Group controlId="formBasicTask">
                                        <Form.Label>제목</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="제목을 적어주세요"
                                            value={task || ""}
                                            onChange={handleTaskChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <Form.Group className="mb-3" controlId="formBasicPosition">
                                        <Form.Label>상태 표시</Form.Label>
                                        <Form.Select
                                            value={selectValue}
                                            onChange={handleSelectChange}
                                        >
                                            {Continents.map((item) => (
                                                <option key={item.key} value={item.value}>
                                                    {item.value}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-sm-3">
                                    <Form.Group className="mb-3" controlId="formBasicPosition">
                                        <Form.Label>완료 목표 일</Form.Label>
                                        <Form.Select
                                            value={selectedPeriod}
                                            onChange={handleSelectPeriodChange}
                                        >
                                            {periodOptions.map((item, index) => (
                                                <option key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-sm-3">
                                    <Form.Group controlId="formBasicTask">
                                        <Form.Label>요청자</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="이름작성 해주세요"
                                            value={requester || ""}
                                            onChange={handlerequesterChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-sm-3">
                                    <Form.Group controlId="formBasicTask">
                                        <Form.Label>요청 담당자</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="이름작성 해주세요"
                                            value={reqManager || ""}
                                            onChange={handlereqManagerChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group controlId="formBasicMemo" className="mt-2">
                                <Form.Label>내용</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={10}
                                    placeholder="내용을 적어주세요"
                                    value={memo || ""}
                                    onChange={handleMemoChange}
                                />
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
    );
}

export default Today;
