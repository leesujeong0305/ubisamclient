import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import useFetch from '../Hooks/useFetch';
import axios from 'axios';

const Continents = [
    { key: 1, value: "대표" },
    { key: 2, value: "상무" },
    { key: 3, value: "이사" },
    { key: 4, value: "부장" },
    { key: 5, value: "차장" },
    { key: 6, value: "과장" },
    { key: 7, value: "대리" },
    { key: 8, value: "사원" }
]

const Personnelinfo = ({ show, onHide }) => {

    const [Name, setName] = useState("")
    const [Position, setPosition] = useState("사원")
    const [Phone, setPhone] = useState(0)
    const [Email, setEmail] = useState("")
    //  연속으로 저장 버튼 클릭시
    const [isLoading, setIsLoading] = useState(false);

    const Userinfo = useFetch("http://14.58.108.70:8877/ContactUs");
    const navigate = useNavigate();

    //console.log(Userinfo);

    const GetNameChangeHandler = (event) => {
        event.preventDefault();
        setName(event.currentTarget.value);
    }

    const GetPositionChangeHandler = (event) => {
        event.preventDefault();
        console.log(event.currentTarget.value);
        setPosition(event.currentTarget.value);
    }

    const GetPhoneChangeHandler = (event) => {
        event.preventDefault();
        setPhone(event.currentTarget.value);
    }

    const GetEmailChangeHandler = (event) => {
        event.preventDefault();
        setEmail(event.currentTarget.value);
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (!isLoading) {
            setIsLoading(true);
            if (!Name || !Position || Phone === 0 || !Email) {
                setIsLoading(false);
                return alert(" 모든 값을 넣어주셔야 합니다.");
            }

            //some 하나라도 조건이 있으면 ture
            const nameresult = Userinfo.some((Userinfo) => Userinfo.name === Name);
            if (nameresult === true) {
                setIsLoading(false);
                return alert(" 이미 등록된 이름 입니다.");
            }

            const emailsult = Userinfo.some((Userinfo) => Userinfo.email === Email);
            if (emailsult === true) {
                setIsLoading(false);
                return alert(" 이미 등록된 Email 입니다.");
            }

            // for(let i = 0; i < Userinfo.length; i++) {
            //   if(Name === Userinfo[i].name) {
            //     setIsLoading(false);
            //     return alert(" 이미 등록된 이름 입니다.");
            //   }
            // }

            axios.post(`http://14.58.108.70:8877/ContactUs`, {
                    //writer: props.user.userData._id,
                    name: Name,
                    position: Position,
                    phone: Phone,
                    email: Email
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then(res => {
                    const data = res.json();
                    if (res.ok) {
                        alert("생성이 완료 되었습니다");
                        navigate(0);
                    } else {
                        console.log("Looks like the response wasn't perfect, got status", res.status);
                        throw Error(data);
                    }
                    setIsLoading(false);
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <>
        

        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">연락망 추가</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>이 름</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            onChange={GetNameChangeHandler}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPosition">
                        <Form.Label>직 급</Form.Label>
                        <Form.Select onChange={GetPositionChangeHandler} value={Position}>
                            {Continents.map((item) => (
                                <option key={item.key} value={item.value}>
                                    {item.value}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPhone ">
                        <Form.Label>핸드폰( - 제외)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter your Phone"
                            onChange={GetPhoneChangeHandler}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            onChange={GetEmailChangeHandler}
                        />
                    </Form.Group>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Button className="btn btn-primary col-2 me-md-2" type="submit">
                            Save
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            Close
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default Personnelinfo