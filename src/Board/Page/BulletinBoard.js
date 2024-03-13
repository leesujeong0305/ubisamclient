import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import ListBoard from '../ListBoard'
import Axios from '../../API/AxiosApi';

// 가정: postData는 제공된 포스트 객체 배열입니다.

const BulletinBoard = () => {
  
  let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
  let dateString = year + '년 ' + month + '월 ' + day + '일 ';

  const [posts, setPosts] = useState([
    {
        Index: 0,
        ProjectName: "Project",
        Date: dateString,
        Name: "",
        Title: "",
        Content: "",
        Status: ""
    },
  ]) // 포스트 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [postsPerPage] = useState(10); // 페이지 당 포스트 수



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

  // 현재 표시할 포스트 계산
  const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지의 마지막 포스트 인덱스
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지의 첫 포스트 인덱스
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지의 포스트 슬라이스
  

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber); // 페이지 번호를 받아 현재 페이지 상태를 업데이트
  //console.log(`currentPosts ${currentPosts}, pageNumber ${paginate} currentPage ${currentPage}`);

  const getBoardData = () => {
    return Axios.post(`http://localhost:8080/Board`, {
        projectName: "First", // 나중에 변경
    }, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => {
        if (response.status === 200) {
            const newDataRow = response.data.data.map((item, index) => ({

                Index: item.Index, // 예시로 index 사용, 실제 구현에서는 서버로부터의 데이터에 따라 조정
                ProjectName: item.ProjectName, // 서버로부터 받은 데이터 구조에 따라 접근
                Date: item.Date, // 예시 날짜, 실제로는 동적으로 설정
                Name: item.Name, // 서버로부터 받은 데이터 구조에 따라 접근
                Title: item.Title, // 서버로부터 받은 데이터 구조에 따라 접근
                Content: item.Content, // 서버로부터 받은 데이터 구조에 따라 접근
                Status: item.Status // 서버로부터 받은 데이터 구조에 따라 접근
            }));
            setPosts(newDataRow); // 상태 업데이트

        } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
            console.log("403");

        }
    }).catch(error => {
        //console.log({error});
        if (error.response.status === 403) {
            alert(`${error.response.data.message}`);
        }
    });
}

  useEffect(() => {
    getBoardData();
  })


  return (
    <div className='container mt-5'>
      <ListBoard posts={currentPosts} pageNumber={currentPage-1}
      postsPerPage={postsPerPage} // 페이지 당 포스트 수
      totalPosts={posts.length} // 전체 포스트 수
      paginate={paginate} // 페이지 번호를 변경하는 함수
      
      />
      <br></br>
      <Pagination
        postsPerPage={postsPerPage} // 페이지 당 포스트 수
        totalPosts={posts.length} // 전체 포스트 수
        paginate={paginate} // 페이지 번호를 변경하는 함수
        currentPage={currentPage} // 현재 페이지 번호
      />
    </div>
  );
};

export default BulletinBoard;