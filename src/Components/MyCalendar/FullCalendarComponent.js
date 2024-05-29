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
    const data = clickInfo.event._def.extendedProps;
    const userData = boardData.find(item => {
      return item.title === clickInfo.event._def.title && item.content === data.content && item.index === data.index;
    });
    if (userData !== undefined) {
      GetBoardData(userData);
    }

    // Perform actions like opening an event detail view or an edit form
  };

  useEffect(() => {

    if (boardData.length <= 0) {
      return;
    }
    const test = new Date();
    const startDate = new Date(boardData[0].date);
    const end = new Date();
    const updatedDataRows = [];
    const endDate = end.setDate(end.getDate() - 1)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 토요일(0) 및 일요일(6) 제외
        const hasEvent = boardData.some(event => event.date === dateStr);
        //console.log('hasEvent', hasEvent);
        if (!hasEvent) {
          updatedDataRows.push({
            title: '데이터가 없습니다',
            date: dateStr,
            Name: '',
            status: '',
            category: '예외',
            content: '',
            project: '',
            textColor: '#333',
            backgroundColor: "#FFF",
            borderColor: "#e5edff",
          });
        }
      }
    }



    let filtered = [];
    if (selectedCategory) {
      if (selectedCategory.has('전 체')) {
        filtered = [...boardData, ...updatedDataRows];
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

        filtered = [...filtered, ...updatedDataRows];
      }
    }
    setFilteredEvents(filtered);
  }, [selectedCategory, boardData]);
  return (
    <div className="calendar-parent">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev', center: 'title', right: 'next,today', }}
        locale={koLocale}
        events={filteredEvents}
        dayCellContent={handleDayCellContent}
        eventClick={handleEventClick}
        height="90vh"
      />
    </div>

  );
}