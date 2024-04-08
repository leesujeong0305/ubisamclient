import React, { useEffect, useState } from 'react'
import Today from './Today';
import EditToday from './EditToday';
import ExcelExport from '../db/Excel/ExcelExport';
import './ListBoard.css';

function ListBoard({ posts, allposts, pageNumber, postsPerPage, totalPage, tab, handleData, selectedProjectName }) {

    const items = [ /* 상태 색상 표기 */
        { id: '대기', color: '#CCCCFF' },
        { id: '진행중', color: '#ADD8E6' },
        { id: '완료', color: '#FFD700' },
        { id: '이슈', color: '#FFC0CB' },
    ];

    const columns = [
        { name: "#", width: "5%" },
        { name: "등록 날짜", width: "7%" },
        { name: "변경 날짜", width: "7%" },
        { name: "이 름", width: "5%" },
        { name: "Title", width: "25%" },
        { name: "To Do List", width: "" },
        { name: "상태", width: "6%" },];

    const [selectvalue, setSelectvalue] = useState(null);
    const [show, setShow] = useState(false);
    const [selectRowIndex, setSelectRowIndex] = useState(false);

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
        const item = items.find(item => item.id === id);
        return item ? item.color : 'white'; // 해당 상태가 없으면 투명색 반환
    };

    // 다이얼로그가 닫혔을 때 실행할 로직
    const handleDialogClose = () => {
        // 다이얼로그 닫힘 후 필요한 작업 수행, 예를 들어, 데이터를 새로 고침
        //getBoardData();
        handleData(true);
        //console.log('setState true');

    };

    const handleClick = () => {
        if (selectedProjectName === 'No Data') {
            alert('프로젝트를 먼저 선택해주세요');
            return;
        }
    }

    return (
        <div>
            <div className='nav-context'>
                <div></div>
                <div className='d-flex gap-2 mb-2'>
                    <Today show={show} onHide={() => setShow(false)} onClick={handleClick} onClose={handleDialogClose} post={null} 
                        selectedProjectName={selectedProjectName} dialogClassName="custom-modal-size" /> 
                    <EditToday show={show} onHide={() => setShow(false)} onClose={handleDialogClose} post={selectvalue} 
                        selectedProjectName={selectedProjectName} dialogClassName="custom-modal-size" />
                    <ExcelExport data={allposts} name={tab} selectedProjectName={selectedProjectName}/>
                </div>
            </div>

            <table className="table table-striped table-hover border-primary table-fixed">
                <thead className="list-Title">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={{ width: col.width }}>{col.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className=''>
                    {posts.map((row, index) => (
                        <tr key={index + 1} onClick={() => { handleRowClick(row); }} style={ getRowStyle(row.Index) }>
                            <td type="checkbox">
                                { row.Index }
                            </td>
                            <td>{row.Date}</td>
                            <td>{}</td>
                            <td>{row.Name}</td>
                            <td className='truncate'>{row.Title}</td>
                            <td className='truncate'>{row.Content}</td>
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
