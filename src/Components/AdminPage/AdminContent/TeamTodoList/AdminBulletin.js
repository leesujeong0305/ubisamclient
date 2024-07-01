import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import LoadBoard from '../../../../Board/Page/LoadBoard';
import GetSubLoadBoard from '../../../../API/GetSubLoadBoard';
import TeamBoard from './TeamBoard';
import Pagination from '../../../../Board/Page/Pagination';
import './AdminBulletin.css'
import SelectItems from '../../../MyCalendar/SelectItems';
import { Scrollbar } from 'react-scrollbars-custom';

const AdminBulletin = ({ allBoard, startDate, endDate, project, useSerch }) => {
  const isLogged = useSelector(state => state.auth.isLoggedIn);
  const [board, setBoard] = useState([]);
  const [filterdBoard, setFilteredBoard] = useState([]);
  const [categoryBoard, setCategoryBoard] = useState([]);
  const [select, setSelect] = useState(new Set());

  //const [posts, setPosts] = useState([]) // 포스트 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [postsPerPage] = useState(15); // 페이지 당 포스트 수
  const [totalPage, setTotalPage] = useState(0); //전체 Page 수

  //탭 추가 필요
  const [selectedTab, setSelectedTab] = useState('전체');
  const tabs = ['전체', ...new Set(filterdBoard.map(item => item.Name))]; // 중복 제거하여 탭 생성
  const filteredItems = selectedTab === '전체' ? filterdBoard : filterdBoard.filter(item => item.Name === selectedTab);

  // 현재 표시할 포스트 계산
  const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지의 마지막 포스트 인덱스
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지의 첫 포스트 인덱스
  const currentPosts = filteredItems.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지의 포스트 슬라이스

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호를 받아 현재 페이지 상태를 업데이트

  const filterBoard = () => {
    if (board === undefined)
      return;
    if (useSerch === false)
      return;
    if (startDate === undefined || endDate === undefined)
      return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filter = board.filter(item => {
      if (item.details === undefined) {
        const targetDate = new Date(item.Date); //등록된 date
        if (targetDate >= start)
          return targetDate >= start && targetDate <= end;
      } else {
        const targetDate = new Date(item.ChangeDate);
        return targetDate >= start && targetDate <= end;
      }
    });
    return filter;
  }

  const filterProject = (item) => {
    if (project === undefined || project === null || project === "전체" || project === "") {
      return item;
    }
    const res = item.filter(value => value.ProjectName === project);
    return res;
  }

  const filterCategory = async (filter) => {
    let filtered = [];
    const updatedDataRows = [];
    if (select) {
      if (select.has('전 체')) {
        filtered = [...filter, ...updatedDataRows];
      } else {
        // 'comp'와 'issue'가 중복 선택될 수 있도록 로직 변경
        if (select.has('대 기')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '대기' : event.details[event.details.length - 1].Status === '대기';
          })];
          console.log('대기 필터', filtered);
        }
        if (select.has('진행중')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '진행중' : event.details[event.details.length - 1].Status === '진행중';
          })];
        }
        if (select.has('완 료')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '완료' : event.details[event.details.length - 1].Status === '완료';
          })];
        }
        if (select.has('이 슈')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '이슈' : event.details[event.details.length - 1].Status === '이슈';
          })];
        }
        if (select.has('알 림')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '알림' : event.details[event.details.length - 1].Status === '알림';
          })];
        }

        filtered = [...filtered, ...updatedDataRows];
      }
    }
    await setFilteredBoard(filtered);
  }


  useEffect(() => {
    const GetAllBoard = async () => {
      if (allBoard) {
        await setBoard(allBoard);
      await setFilteredBoard(allBoard);
      // console.log('allBoard', allBoard);
      const total = allBoard.length / postsPerPage;
      setTotalPage(total);
      }
      
    }
    GetAllBoard();
  }, [isLogged, allBoard])

  useEffect(() => {
    const Filter = async () => {
      let filter = filterBoard();
      if (filter === undefined)
        filter = [...board];
       filter = filterProject(filter);
      await filterCategory(filter);
      setCurrentPage(1);
      setSelectedTab('전체');
    }
    Filter();
  }, [startDate, endDate, select, project])

  return (
    <div>
      <div className="nav-context">
      {select && <SelectItems select={select} setSelect={setSelect} isAdmin={true} />} {/* 검색기능과 개별로 동작되게  */}
      
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
      </div>
      <div>
        <TeamBoard
          posts={currentPosts}
          pageNumber={currentPage - 1}
          postsPerPage={postsPerPage}
          totalPage={totalPage} // 페이지 당 포스트 수
          tab={selectedTab}
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
  )
}

export default AdminBulletin