import React, { useState } from 'react'
import Today from './Today';
import EditToday from './EditToday';
import ExcelExport from '../db/Excel/ExcelExport';
import './ListBoard.css';

function ListBoard({ posts, allposts, pageNumber, postsPerPage, tab }) {

    const items = [ /* 상태 색상 표기 */
        { id: '대기', color: '#CACACA' }, //#ADD8E6
        { id: '진행중', color: '#FFD700' },
        { id: '완료', color: '#90EE90' },
        { id: '이슈', color: '#FFC0CB' },
    ];

    const columns = [
        { name: "#", width: "5%" },
        { name: "날짜", width: "10%" },
        { name: "이 름", width: "10%" },
        { name: "Title", width: "20%" },
        { name: "To Do List", width: "40%" },
        { name: "상태", width: "10%" },];

    const [selectvalue, setSelectvalue] = useState(null);
    const [show, setShow] = useState(false);
    const handleRowClick = (row) => {
        console.log('클릭된 행의 데이터:', row);
        setSelectvalue(row);
    }

    // 상태에 따른 색상을 찾는 함수
    const findColorById = (id) => {
        const item = items.find(item => item.id === id);
        return item ? item.color : 'white'; // 해당 상태가 없으면 투명색 반환
    };

    // 다이얼로그가 닫혔을 때 실행할 로직
    const handleDialogClose = () => {
        // 다이얼로그 닫힘 후 필요한 작업 수행, 예를 들어, 데이터를 새로 고침
        //getBoardData();
    };

    return (
        <div>
            <div className='nav-context'>
                <div></div>
                <div className='d-flex gap-2 mb-2'>
                    <ExcelExport data={allposts} name={tab} />
                    <div>
                        <EditToday show={show} onHide={() => setShow(false)} onClose={handleDialogClose} post={selectvalue} dialogClassName="custom-modal-size" />
                    </div>
                    <div>
                        <Today show={show} onHide={() => setShow(false)} onClose={handleDialogClose} post={null} dialogClassName="custom-modal-size" />
                    </div>
                </div>
            </div>

            <table className="table table-striped table-hover border-primary table-fixed">
                <thead className="text-dark list-Title" >
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={{ width: col.width }}>{col.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {posts.map((row, index) => (
                        <tr key={index + 1} onClick={() => handleRowClick(row)}>
                            <td type="checkbox">
                                {" "}
                                {(index + 1) + (postsPerPage * pageNumber)}
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
