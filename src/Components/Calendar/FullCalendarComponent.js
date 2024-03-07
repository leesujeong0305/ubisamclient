import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLocale from '@fullcalendar/core/locales/ko'; // 한국어 locale import
import './FullCalendarComponent.css';

export default function FullCalendarComponent() {

   // 날짜 셀의 내용을 조정하는 함수
   const handleDayCellContent = (args) => {
    // 'args.dayNumberText'에는 날짜 숫자와 '일' 문자가 포함되어 있습니다.
    // 이를 사용자 정의 포맷으로 바꿔줍니다.
    return { html: args.dayNumberText.replace('일', '') };
  };


  return (
    <body style={{backgroundcolor: '#F6D6D6', margin: '10px'}}>

    
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
    </body>
  );
}