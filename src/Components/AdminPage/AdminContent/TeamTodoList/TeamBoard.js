import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Form, Modal, Button } from 'react-bootstrap';
import './TeamBoard.css'


const TeamBoard = ({ posts }) => {

    const Continents = [ /* 상태 색상 표기 */
        { key: 1, value: '대기', color: '#CCCCFF', letter: '대' },
        { key: 2, value: '진행중', color: '#ADD8E6', letter: '진' },
        { key: 3, value: '완료', color: '#FFD700', letter: '완' },
        { key: 4, value: '이슈', color: '#FFC0CB', letter: '이' },
        { key: 5, value: '알림', color: '#E64F5A', letter: '알' },
    ];

    const columns = [
        { name: "#", width: "2.5%" },
        { name: "프로젝트", width: "13%" },
        { name: "날짜 / 최초등록날짜", width: "13%" },
        { name: "이 름", width: "5%" },
        { name: "Title", width: "23%" },
        { name: "To Do List", width: "" },
        { name: "목표일", width: "5%" },
        { name: "상태", width: "5%" },];

    const [selectedRowData, setSelectedRowData] = useState(null);
    const [board, setBoard] = useState([]);
    const [show, setShow] = useState(false);

    // 상태에 따른 색상을 찾는 함수
    const findColorById = (id) => {
        const item = Continents.find(item => item.value === id);
        return item ? item.color : 'white'; // 해당 상태가 없으면 투명색 반환
    };

    //목표일에 따른 색상 변경
    const findDayById = (id) => {
        if (id.includes('D-')) {
            return 'red';
        } else {
            return id.color;
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = (row) => {
        setSelectedRowData(row);
        setShow(true);
    };

    useEffect(() => {
        console.log('포스트 갯수', posts.length);
        if (posts !== undefined) {
            setBoard([]);
            setBoard(posts);
        }
    }, [posts])

    return (
        <div>
            <table className="table table-striped table-hover table-fixed">
                <thead className="list-Title">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={{ width: col.width }}>
                                {col.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="">
                    {board.map((row, index) => (
                        <tr
                            key={index + 1}
                            onClick={() => {
                                handleShow(row);
                            }}
                        >
                            <td>{row.Index}</td>
                            <td className="truncate">{row.ProjectName}</td>
                            <td>{row.ChangeDate ? row.ChangeDate === row.Date ? row.Date : `${row.ChangeDate} / ${row.Date}` : row.Date }</td>
                            <td>{row.Name}</td>
                            <td className="truncate">{row.Title}</td>
                            <td className="truncate">
                                <div className="preview-container">
                                    {row.Content}
                                </div>
                            </td>
                            <td>
                                <div style={{ color: findDayById(`${row.Period}`) }}>
                                    {row.Period}
                                </div>
                            </td>
                            <td>
                                <div style={{ backgroundColor: findColorById(`${row.details === undefined ? row.Status : row.details[row.details.length - 1].Status}`) }}>
                                    {row.details === undefined ? row.Status : row.details[row.details.length - 1].Status}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                        <Modal.Title style={{ color: "#7952B3", fontWeight: "bold", display: "flex" }}>
                            To Do View
                        </Modal.Title>
                    </Modal.Header>
                <Modal.Body>
                    <Form style={{ textAlign: "left" }}>
                    <div className="row">
                            <div className='col-sm-6'>
                                <Form.Group controlId="formBasicTask">
                                    <Form.Label>프로젝트</Form.Label>
                                    <Form.Control type="text" placeholder="제목을 적어주세요" value={selectedRowData?.ProjectName || ''} readOnly />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-sm-12'>
                                <Form.Group controlId="formBasicTask">
                                    <Form.Label>제목</Form.Label>
                                    <Form.Control type="text" placeholder="제목을 적어주세요" value={selectedRowData?.Title || ''} readOnly />
                                </Form.Group>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-sm-4'>
                                <Form.Group controlId="formBasicPosition">
                                    <Form.Label>상태 표시</Form.Label>
                                    <Form.Select value={selectedRowData?.Status} readOnly>
                                        {Continents.map((item) => (
                                            <option key={item.key} value={item.value} >
                                                {selectedRowData?.details ? selectedRowData.details[selectedRowData.details.length - 1].Status : item.value || ''}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className='col-sm-4'>
                                <Form.Group controlId="formBasicPosition">
                                    <Form.Label>요청자</Form.Label>
                                    <Form.Control type="text" value={selectedRowData?.Requester || ''} readOnly />
                                </Form.Group>
                            </div>
                            <div className='col-sm-4'>
                                <Form.Group controlId="formBasicPosition">
                                    <Form.Label>요청 담당자</Form.Label>
                                    <Form.Control type="text" value={selectedRowData?.ReqManager || ''} readOnly />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="task-container">
                            {selectedRowData?.details?.length > 0 ? (
                                <>
                                    <div className="task-title"> - 진행 내용 - </div>
                                    <div className="group-box">
                                        {selectedRowData?.details.map((step, index) => {
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
                                                    {index !== selectedRowData?.details?.length - 1 && <hr />}{" "}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </>
                            ) :
                                <>
                                    <div className="task-title"> - 진행 내용 - </div>
                                    <div className="group-box">
                                        <React.Fragment >
                                            <div className="task-step">

                                                <div className="task-description">{`${selectedRowData?.Content}`}</div>
                                            </div>

                                        </React.Fragment>
                                    </div>
                                </>
                            }
                        </div>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}


export default TeamBoard
