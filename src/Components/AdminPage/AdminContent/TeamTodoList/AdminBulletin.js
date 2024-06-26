import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import LoadBoard from '../../../../Board/Page/LoadBoard';
import GetSubLoadBoard from '../../../../API/GetSubLoadBoard';
import TeamBoard from './TeamBoard';
import Pagination from '../../../../Board/Page/Pagination';

const AdminBulletin = ({startDate, endDate, selectedCategory, useSerch, name}) => {
    const isLogged = useSelector(state => state.auth.isLoggedIn);
    const [board, setBoard] = useState([]);
    const [filterdBoard, setFilteredBoard] = useState([]);
    const [categoryBoard, setCategoryBoard] = useState([]);

    //const [posts, setPosts] = useState([]) // 포스트 데이터 상태 관리
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const [postsPerPage] = useState(20); // 페이지 당 포스트 수
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


    const LoadAllBoard = async () => {
        const mainBoard = await LoadBoard("All");
        //console.log('main', mainBoard);
        const subBoard = await GetSubLoadBoard("All");
        //console.log('sub', subBoard);
        const subData = subBoard.data;
        //console.log('sub', subData);
        if (subData === undefined) {
            return mainBoard;
        }

        // 각 targetIndex에 맞는 데이터 항목에 상세 정보를 추가하는 함수
        subData.forEach(detail => {
            // 해당 targetIndex를 가진 객체를 찾습니다.
            let item = mainBoard.find(item => item.Key === detail.FieldNum);
            if (item) {
                // details 속성이 없다면 초기화합니다.
                if (!item.details) {
                    item.details = [JSON.parse(JSON.stringify(item))]; //status 업데이트를 위해 복사해서 초기화함
                }

                // details 배열에 상세 정보를 추가합니다. targetIndex는 제외합니다.
                item.details.push({
                    Index: detail.Index,
                    ProjectName: detail.ProjectName,
                    Date: detail.Date,
                    ChangeDate: detail.ChangeDate,
                    Name: detail.Name,
                    Title: detail.Title,
                    Content: detail.Content,
                    Status: detail.Status,
                    FieldNum: detail.FieldNum,
                    FieldSubNum: detail.FieldSubNum,
                });
                item.details[0].Status = item.details[item.details.length - 1].Status;
            }
        });
        //console.log('loadBoards', mainBoard);
        return mainBoard;
    }

    const UpdateStatus = async (data) => {
        if (data === undefined)
            return;
        let alertTitles = [];
        const today = new Date(); // 기준 날짜는 오늘로 설정
        data = data.map((item) => {
                const itemDate = new Date(item.Date);
                const diffTime = Math.abs(today - itemDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일 단위로 차이를 계산


                // item.details 배열이 존재하는지 확인 후 모든 항목의 Status를 확인
                const setDay = parseInt(item.Period.replace(/[^0-9]/g, ''), 10);
                const detailsStatuses = item.details ? item.details.map(detail => detail.Status) : [];

                const difference = diffDays - setDay;
                //console.log('itemDate', item.Title, itemDate);
                //console.log('difference 계산 ', difference, diffDays, setDay);
                // 15일 이상 차이가 나고 Status가 '완료' 및 '이슈'가 아닌 경우 '알림'으로 변경

                if (item.details) {
                    if (item.details[0].Status === '완료') {
                        item.Period = '👍';
                    } else if (item.details[0].Status === '이슈') {
                        item.Period = '🚨';
                    }
                    else {
                        if (difference > 0) {
                            item.Period = `D-${Math.abs(difference)}`;
                        } else if (difference < 0) {
                            item.Period = `${Math.abs(difference)}일`;
                        } else {
                            item.Period = `D-Day`;
                        }
                    }
                } else {
                    if (item.Status === '완료') {
                        item.Period = '👍';
                    } else if (item.Status === '이슈') {
                        item.Period = '🚨';
                    } else {
                        if (difference > 0) {
                            item.Period = `D-${Math.abs(difference)}`;
                        } else if (difference < 0) {
                            item.Period = `${Math.abs(difference)}일`;
                        } else {
                            item.Period = `D-Day`;
                        }
                    }

                }

                if (
                    diffDays > setDay &&
                    item.Status !== "완료" &&
                    item.Status !== "이슈" &&
                    detailsStatuses.every(
                        (status) => status !== "완료" && status !== "이슈"
                    )
                    // 15일 이상 차이가 나고 Status가 '완료' 및 '이슈'가 아닌 경우 '이슈'로 변경
                ) {
                    item.Status = "알림";
                    alertTitles.push({ title: item.Title, key: item.Key }); // 제목과 키를 alertTitles 배열에 추가
                }
                return item;
            });
            return data;
    }

    const filterBoard = () => {
        if (board === undefined)
            return;
        if (useSerch === false)
            return;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const filter = board.filter(item => {
            if (item.details === undefined) {
                const targetDate = new Date(item.Date);
                if (targetDate > start)
                return targetDate >= start && targetDate <= end;
            } else {
                const targetDate = new Date(item.ChangeDate);
                return targetDate >= start && targetDate <= end;
            }
        });
        //console.log('target', filter);
        //setFilteredBoard(filter);
        return filter;
    }

    const filterName = (filter) => {
        if (name === undefined || name === "")
            return;
        const result = filter.filter(event => event.Name === name);
        return result;
    }

    const filterCategory = async (filter) => {
        let filtered = [];
        const updatedDataRows = [];
    if (selectedCategory) {
      if (selectedCategory.has('전 체')) {
        filtered = [...filter, ...updatedDataRows];
      } else {
        // 'comp'와 'issue'가 중복 선택될 수 있도록 로직 변경
        if (selectedCategory.has('대 기')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '대기' : event.details[0].Status === '대기';
        })];
          console.log('대기 필터', filtered);
        }
        if (selectedCategory.has('진행중')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '진행중' : event.details[0].Status === '진행중';
          })];
        }
        if (selectedCategory.has('완 료')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '완료' : event.details[0].Status === '완료';
          })];
        }
        if (selectedCategory.has('이 슈')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '이슈' : event.details[0].Status === '이슈';
          })];
        }
        if (selectedCategory.has('알 림')) {
          filtered = [...filtered, ...filter.filter(event => {
            return event.details === undefined ? event.Status === '알림' : event.details[0].Status === '알림';
          })];
        }

        filtered = [...filtered, ...updatedDataRows];
      }
    }
    await setFilteredBoard(filtered);
    }


    useEffect(() => {
        const GetAllBoard = async () => {
            const data = await LoadAllBoard();
            const updata = await UpdateStatus(data);
            await setBoard(updata);
            await setFilteredBoard(updata);
            const total = updata.length / postsPerPage;
            setTotalPage(total);
        }
        GetAllBoard();
    }, [isLogged])

    useEffect(() => {
        const Filter = async() => {
            let filter = filterBoard();
            if (filter === undefined)
                filter = [...board];
            let nameFilter = filterName(filter);
            if (nameFilter === undefined)
                nameFilter = filter;
            await filterCategory(nameFilter);

        }
        

        Filter();
    }, [startDate, endDate, selectedCategory, name])

    // useEffect(() => {
    //     //if (startDate === undefined && endDate === undefined)
    //     //    setCategoryBoard()
    //     const LoadCategoryFilter = async () => {
    //         if (startDate === undefined && endDate ===  undefined)
    //             await setFilteredBoard(board);
            
    //         await filterCategory();
    //     }
        
        
    //     LoadCategoryFilter();
    // }, [])

    return (
        <div>
            <div>
                <TeamBoard
                    posts={currentPosts}
                    pageNumber={currentPage - 1}
                    postsPerPage={postsPerPage}
                    totalPage={totalPage} // 페이지 당 포스트 수
                    tab={selectedTab}
                //handleData={handleData}

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