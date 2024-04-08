import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import ListBoard from '../ListBoard'
import LoadBoard from './LoadBoard'
import './BulletinBoard.css'

// 가정: postData는 제공된 포스트 객체 배열입니다.

const BulletinBoard = ({boardData, handleData, selectedProjectName}) => {
  const [posts, setPosts] = useState([]) // 포스트 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [postsPerPage] = useState(10); // 페이지 당 포스트 수


  //탭 추가 필요
  const [selectedTab, setSelectedTab] = useState('전체');
  const tabs = ['전체', ...new Set(posts.map(item => item.Name))]; // 중복 제거하여 탭 생성
  const filteredItems = selectedTab === '전체' ? posts : posts.filter(item => item.Name === selectedTab);
  
  // 현재 표시할 포스트 계산
  const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지의 마지막 포스트 인덱스
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지의 첫 포스트 인덱스
  const currentPosts = filteredItems.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지의 포스트 슬라이스

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호를 받아 현재 페이지 상태를 업데이트

  useEffect(() => {
    
    if (boardData)
      setPosts(boardData);
  }, [boardData], )

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab])

  useEffect(() => {
    setSelectedTab('전체');
  }, [])

  return (
    <div>
      <div className='d-flex nav-context'>
        <div className="nav-container">
                      {tabs.map(tab => (
                          <button className={selectedTab === tab ? "tab-button" : "nav-tab"} key={tab} onClick={() => setSelectedTab(tab)}>
                            {tab}
                          </button>
                      ))}
          </div>
        </div>
      <div>
        <ListBoard posts={currentPosts} allposts={posts} pageNumber={currentPage - 1}
          postsPerPage={postsPerPage} // 페이지 당 포스트 수
          tab={selectedTab} handleData={handleData} selectedProjectName={selectedProjectName}
        />
      </div>
      <br></br>
      <div>
        <Pagination
          postsPerPage={postsPerPage} // 페이지 당 포스트 수
          totalPosts={filteredItems.length} // 전체 포스트 수
          paginate={paginate} // 페이지 번호를 변경하는 함수
          currentPage={currentPage} // 현재 페이지 번호
        />
      </div>
    </div>
  );
};

export default BulletinBoard;