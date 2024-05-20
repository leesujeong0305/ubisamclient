import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko'; // 한국어 locale import
import './FullCalendarComponent.css';

export default function FullCalendarComponent({ selectedCategory, boardData, GetBoardData }) {
  const [filteredEvents, setFilteredEvents] = useState([]);
  
  // 날짜 셀의 내용을 조정하는 함수
  const handleDayCellContent = (args) => {
    // 'args.dayNumberText'에는 날짜 숫자와 '일' 문자가 포함되어 있습니다.
    // 이를 사용자 정의 포맷으로 바꿔줍니다.
    return { html: args.dayNumberText.replace('일', '') };
  };

  const handleEventClick = (clickInfo) => {
    // clickInfo is an object containing event information and more
    console.log("Event clicked: ", clickInfo.event);

     console.log(clickInfo.event._def.title);
    const userData = boardData.filter(item=>{
      return item.title === clickInfo.event._def.title;
    })[0];
    GetBoardData(userData);
    // Perform actions like opening an event detail view or an edit form
  };

  useEffect(() => {
    let filtered = [];
    if (selectedCategory) {
      if (selectedCategory.has('전 체')) {
        console.log("boardData 33",boardData);
        filtered = boardData;
      } else {
        // 'comp'와 'issue'가 중복 선택될 수 있도록 로직 변경
        if (selectedCategory.has('대 기')) {
          filtered = [...filtered, ...boardData.filter(event => event.category === '대기')];
        }
        if (selectedCategory.has('진행중')) {
          filtered = [...filtered, ...boardData.filter(event => event.category === '진행중')];
        }
        if (selectedCategory.has('완 료')) {
          filtered = [...filtered, ...boardData.filter(event => event.category === '완료')];
        }
        if (selectedCategory.has('이 슈')) {
          filtered = [...filtered, ...boardData.filter(event => event.category === '이슈')];
        }
        if (selectedCategory.has('알 림')) {
          filtered = [...filtered, ...boardData.filter(event => event.category === '알림')];
        }
      }
    }
    setFilteredEvents(filtered);
  }, [selectedCategory, boardData]);
  return (
    <div className="calendar-parent" >
      <FullCalendar className="fc-daygrid-day-events real-event-container-class"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev',center: 'title',right: 'next,today'}}
        locale={koLocale}
        events={filteredEvents}
        dayCellContent={handleDayCellContent}
        eventClick={handleEventClick}
        height="90vh"
      />
    </div>

  );
}