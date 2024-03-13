import React, { useState, useEffect, useRef } from 'react'
import Axios from '../API/AxiosApi';

import Today from './Today';
import EditToday from './EditToday';
import Pagination from './Page/Pagination';
import './ListBoard.css';

function ListBoard({posts, pageNumber, postsPerPage}) {

    const items = [ /* 상태 색상 표기 */
        { id: '대기', color: '#CACACA' }, //#ADD8E6
        { id: '진행중', color: '#FFD700' },
        { id: '완료', color: '#90EE90' },
        { id: '이슈', color: '#FFC0CB' },
    ];

    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let dateString = year + '년 ' + month + '월 ' + day + '일 ';

    const columns = [
        { name: "#", width: "5%" },
        { name: "날짜", width: "10%" },
        { name: "이 름", width: "10%" },
        { name: "Title", width: "20%" },
        { name: "To Do List", width: "40%" },
        { name: "상태", width: "10%" },];

    const [selectvalue, setSelectvalue] = useState(null);

    const [show, setShow] = useState(false);

    const [dataRow, setDataRow] = useState([
        {
            Index: 0,
            ProjectName: "Project",
            Date: dateString,
            Name: "",
            Title: "",
            Content: "",
            Status: ""
        },
    ])
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호를 받아 현재 페이지 상태를 업데이트
    
    const tabs = ['전체', '경매', '입찰', '발견', '더보기'];
    const [currentTab, setCurrentTab] = useState(0);

    const handleRowClick = (row) => {
        console.log('클릭된 행의 데이터:', row);
        setSelectvalue(row);
    }

    // 상태에 따른 색상을 찾는 함수
    const findColorById = (id) => {
        const item = items.find(item => item.id === id);
        return item ? item.color : 'white'; // 해당 상태가 없으면 투명색 반환
    };

    // const getBoardData = () => {
    //     return Axios.post(`http://localhost:8080/Board`, {
    //         projectName: "First", // 나중에 변경
    //     }, {
    //         headers: {
    //             "Content-Type": "application/json",
    //         }
    //     }).then(response => {
    //         if (response.status === 200) {
    //             const newDataRow = response.data.data.map((item, index) => ({
    //                 Index: item.Index, // 예시로 index 사용, 실제 구현에서는 서버로부터의 데이터에 따라 조정
    //                 ProjectName: item.ProjectName, // 서버로부터 받은 데이터 구조에 따라 접근
    //                 Date: item.Date, // 예시 날짜, 실제로는 동적으로 설정
    //                 Name: item.Name, // 서버로부터 받은 데이터 구조에 따라 접근
    //                 Title: item.Title, // 서버로부터 받은 데이터 구조에 따라 접근
    //                 Content: item.Content, // 서버로부터 받은 데이터 구조에 따라 접근
    //                 Status: item.Status // 서버로부터 받은 데이터 구조에 따라 접근
    //             }));
    //             setDataRow(newDataRow); // 상태 업데이트

    //         } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
    //             console.log("403");

    //         }
    //     }).catch(error => {
    //         //console.log({error});
    //         if (error.response.status === 403) {
    //             alert(`${error.response.data.message}`);
    //         }
    //     });
    // }

    // 다이얼로그가 닫혔을 때 실행할 로직
    const handleDialogClose = () => {
        // 다이얼로그 닫힘 후 필요한 작업 수행, 예를 들어, 데이터를 새로 고침
        //getBoardData();
    };

    useEffect(() => {
        //getBoardData();
    }, []);

    const selectMenuHandler = (index) => {
        
        setCurrentTab(index);
      };

    return (
        <div>
            <div className='d-flex sss'>
            <div className="nav-container">
                {tabs.map((tab, index) => (
                    <button key={index} className={currentTab === index ? "tab-button" : "nav-tab"} onClick={()=> selectMenuHandler(index)}>
                        {tab}
                    </button>
                ))}
            </div>
            <div className="d-flex gap-2 mb-2 plus-edit">
                <EditToday show={show} onHide={() => setShow(false)} onClose={handleDialogClose} post={selectvalue} dialogClassName="custom-modal-size" />
                <Today show={show} onHide={() => setShow(false)} onClose={handleDialogClose} post={null} dialogClassName="custom-modal-size" />    
            </div>
            </div>
            

            

            <table className="table table-striped table-hover border-primary table-fixed">
                <thead className="text-dark lesss" >
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={{ width: col.width }}>{col.name}</th>
                            //<th align="center" key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {posts.map((row, index) => (
                        <tr key={index + 1} onClick={() => handleRowClick(row)}>
                            <td type="checkbox">
                                {" "}
                                {(index + 1) +(postsPerPage * pageNumber) }
                            </td>
                            <td>{row.Date}</td>
                            <td>{row.Name}</td>
                            <td>{row.Title}</td>
                            <td>{row.Content}</td>
                            <td>
                                <div style={{ backgroundColor: findColorById(`${row.Status}`) }}>{row.Status}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
            
        
    )
}

export default ListBoard
