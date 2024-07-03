import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import Pagination from '../../../../Board/Page/Pagination';
//import './AdminTeamBulletin.css'
import TeamProjectBoard from './TeamProjectBoard';

const AdminTeamBulletin = ({ data }) => {
    const isLogged = useSelector(state => state.auth.isLoggedIn);
    const [board, setBoard] = useState([]);

    //const [posts, setPosts] = useState([]) // 포스트 데이터 상태 관리
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const [postsPerPage] = useState(15); // 페이지 당 포스트 수
    const [totalPage, setTotalPage] = useState(0); //전체 Page 수

    //탭 추가 필요
    //   const [selectedTab, setSelectedTab] = useState('전체');
    //   const tabs = ['전체', ...new Set(board.map(item => item.Name))]; // 중복 제거하여 탭 생성
    //   const filteredItems = selectedTab === '전체' ? filterdBoard : filterdBoard.filter(item => item.Name === selectedTab);

    // 현재 표시할 포스트 계산
    const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지의 마지막 포스트 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지의 첫 포스트 인덱스
    const currentPosts = board.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지의 포스트 슬라이스

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호를 받아 현재 페이지 상태를 업데이트


    useEffect(() => {
        const GetAllBoard = async () => {
            if (data) {
                await setBoard(data);
                // console.log('allBoard', allBoard);
                const total = data.length / postsPerPage;
                setTotalPage(total);
            }

        }
        GetAllBoard();
    }, [isLogged, data])




    return (
        <div>
            {/* <div className="nav-context">
      {select && <SelectItems select={select} setSelect={setSelect} isAdmin={true} />}
      
        <div className="nav-container scroll">
          {tabs.map((tab) => (
            <button
              className={selectedTab === tab ? "tab-button" : "nav-tab"}
              key={tab}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div> */}
            <div>
                {/* <TeamBoard
          posts={currentPosts}
          pageNumber={currentPage - 1}
          postsPerPage={postsPerPage}
          totalPage={totalPage} // 페이지 당 포스트 수
          tab={selectedTab}
        /> */}
                <TeamProjectBoard posts={currentPosts} totalPage={totalPage} />
            </div>
            <br></br>
            <div>
                <Pagination
                    postsPerPage={postsPerPage} // 페이지 당 포스트 수
                    totalPosts={board.length} // 전체 포스트 수
                    paginate={paginate} // 페이지 번호를 변경하는 함수
                    currentPage={currentPage} // 현재 페이지 번호
                />
            </div>
        </div>
    )
}

export default AdminTeamBulletin