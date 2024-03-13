import React, { useState, useEffect } from 'react'
import Axios from '../../API/AxiosApi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko'; // 한국어 locale import
import './FullCalendarComponent.css';

export default function FullCalendarComponent() {

  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let dateString = year + '년 ' + month + '월 ' + day + '일 ';
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


  // 날짜 셀의 내용을 조정하는 함수
  const handleDayCellContent = (args) => {
    // 'args.dayNumberText'에는 날짜 숫자와 '일' 문자가 포함되어 있습니다.
    // 이를 사용자 정의 포맷으로 바꿔줍니다.
    return { html: args.dayNumberText.replace('일', '') };
  };

  const getBoardData = () => {
    return Axios.post(`http://localhost:8080/Board`, {
      projectName: "First", // 나중에 변경
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      console.log({ response });
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
        setDataRow(newDataRow); // 상태 업데이트

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

  return (

    <div className="calendar-parent" >

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev', // 좌측 버튼 그룹: '이전', '다음', '오늘'
          center: 'title', // 중앙: 달력 제목
          right: 'next,today' // 우측 버튼 그룹: 빈 문자열로 설정하여 비활성화
        }}
        
        weekends={true}
        locale={koLocale} // 한국어 locale 적용
        events={[
          { title: '이벤트 1', date: '2024-03-17' },
          { title: '이벤트 2', date: '2024-03-19' }
        ]}
        // 여기에 스타일을 추가합니다.
        dayCellContent={handleDayCellContent} // 날짜 셀 커스텀 렌더링 1일 -> 1
        height="700px" // 높이 조절
      />
    </div>

  );
}