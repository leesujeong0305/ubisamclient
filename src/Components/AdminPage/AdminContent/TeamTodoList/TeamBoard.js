import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';

import EditToday from '../../../../Board/EditToday';
import { Form, Modal, Button } from 'react-bootstrap';



const TeamBoard = ({ posts }) => {


    // const items = [ /* 상태 색상 표기 */
    //     { id: '대기', color: '#CCCCFF' },
    //     { id: '진행중', color: '#ADD8E6' },
    //     { id: '완료', color: '#FFD700' },
    //     { id: '이슈', color: '#FFC0CB' },
    //     { id: '알림', color: '#E64F5A' },
    // ];

    const Continents = [ /* 상태 색상 표기 */
        { key: 1, value: '대기', color: '#CCCCFF', letter: '대' },
        { key: 2, value: '진행중', color: '#ADD8E6', letter: '진' },
        { key: 3, value: '완료', color: '#FFD700', letter: '완' },
        { key: 4, value: '이슈', color: '#FFC0CB', letter: '이' },
        { key: 5, value: '알림', color: '#E64F5A', letter: '알' },
    ];

    const columns = [
        { name: "#", width: "2%" },
        { name: "프로젝트", width: "12%" },
        { name: "등록 날짜", width: "7%" },
        { name: "변경 날짜", width: "7%" },
        { name: "이 름", width: "5%" },
        { name: "Title", width: "25%" },
        { name: "To Do List", width: "" },
        { name: "목표일", width: "5%" },
        { name: "상태", width: "5%" },];

    const isLogged = useSelector(state => state.auth.isLoggedIn);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [board, setBoard] = useState([]);
    const [selectvalue, setSelectvalue] = useState(null);
    const [show, setShow] = useState(false);
    const [selectRowIndex, setSelectRowIndex] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');

    const handleTaskChange = (e) => setTitle(e.target.value);
    const handleMemoChange = (e) => setContent(e.target.value);

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    }

    const handleRowClick = (row) => {
        console.log('클릭된 행의 데이터:', row, row.Index);
        setSelectvalue(row);
        setSelectRowIndex(row.Index);

    }

    const getRowStyle = (index) => {
        return index === selectRowIndex ? { backgroundColor: '#fff3cd' } : {}; // 클릭된 행의 배경색을 lightblue로 설정, 아니면 기본색
    };

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

    // // 말풍선 위치 상태
    // const [previewPos, setPreviewPos] = useState({ top: 0, left: 0 });

    // // 마우스 움직임에 따라 말풍선 위치 업데이트
    // const handleMouseMove = (e) => {

    //     //console.log(`Mouse Position - X: ${e.clientX}, Y: ${e.clientY}`);
    //     let newTop = e.clientY - 250; // 마우스 위에 말풍선 위치
    //     let newLeft = e.clientX + 50;


    //     if(newLeft > 1300){
    //         newLeft = newLeft - 560;
    //     }

    //     setPreviewPos({ top: newTop, left: newLeft });
    //     // setPreviewPos({
    //     //     top: e.clientY - 250, // 마우스 포인터 아래로 조금 떨어진 위치
    //     //     left: e.clientX + 50, // 마우스 포인터의 가운데 정도에 위치
    //     // });
    // };

    // 다이얼로그가 닫혔을 때 실행할 로직
    const handleDialogClose = () => {
        // 다이얼로그 닫힘 후 필요한 작업 수행, 예를 들어, 데이터를 새로 고침
        //getBoardData();
        setSelectvalue(null);
        setSelectRowIndex(false);
        //console.log('setState true');

    };

    const openModal = (row) => {
        setSelectedRowData(row);
        setShow(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedRowData(null);
    };

    const handleClose = () => setShow(false);
    const handleShow = (row) => {
        setSelectedRowData(row);
        setShow(true);
    };

    useEffect(() => {
        if (posts !== undefined) {
            setBoard(posts);
        }
    }, [posts])


    return (
        <div>
            <table className="table table-striped table-hover border-primary table-fixed">
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
                                openModal(row);
                            }}
                            style={getRowStyle(row.Index)}
                        >
                            <td type="checkbox">
                                {" "}
                                {row.Index}
                            </td>
                            <td>{row.ProjectName}</td>
                            <td>{row.Date}</td>
                            <td>{row.ChangeDate}</td>
                            <td>{row.Name}</td>
                            <td>{row.Title}</td>
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
                                <div style={{ backgroundColor: findColorById(`${row.details === undefined ? row.Status : row.details[0].Status}`) }}>
                                    {row.details === undefined ? row.Status : row.details[0].Status}
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
                                                {item.value || ''}
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
