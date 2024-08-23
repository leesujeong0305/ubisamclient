import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import ListBoard from '../ListBoard'
import './BulletinBoard.css'

// 가정: postData는 제공된 포스트 객체 배열입니다.

const BulletinBoard = ({boardData, handleData, selectedProjectName, selectedTitle}) => {
  const [posts, setPosts] = useState([]) // 포스트 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [postsPerPage] = useState(10); // 페이지 당 포스트 수
  const [totalPage, setTotalPage] = useState(0); //전체 Page 수


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
    const total = boardData.length / postsPerPage;
    setTotalPage(total);
  }, [boardData])

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab])

  useEffect(() => {
    setSelectedTab('전체');
    setCurrentPage(1);
  }, [selectedProjectName])

  useEffect(() => {
    let filteredItems = [];
    setSelectedTab('전체');
    if (boardData) {
      if (selectedTitle === "전체") {
        setPosts(boardData);
      }
      else {
        filteredItems = boardData.filter(item => {
          // details가 존재하고 길이가 0보다 크면, 마지막 details의 Status를 확인
          if (item.details && item.details.length > 0) {
              return item.details[item.details.length - 1].Status === selectedTitle;
          }
          // 그렇지 않으면, item의 Status만 확인
          return item.Status === selectedTitle;
      });
        setPosts(filteredItems);
      }
    }
  }, [selectedTitle])

  return (
    <div>
      <div className="d-flex nav-context">
        <div className="nav-container">
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
      </div>
      <div>
        <ListBoard
          posts={currentPosts}
          allposts={posts}
          pageNumber={currentPage - 1}
          postsPerPage={postsPerPage}
          totalPage={totalPage} // 페이지 당 포스트 수
          tab={selectedTab}
          handleData={handleData}
          selectedProjectName={selectedProjectName}
        />
      </div>
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