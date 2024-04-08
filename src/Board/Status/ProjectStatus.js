import React, { useState, useEffect } from 'react';
import './ProjectStatus.css'; // Make sure to create a corresponding CSS file

const ProjectStatus = ({ boardData, pm }) => {
  const [tabStep, setTabStep] = useState([]);
  const [tabData, setTabData] = useState([]);

  const colorStep = ['#CCCCFF', '#ADD8E6', '#FFD700', '#FFC0CB'];

  let today = new Date();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let dateString = month + '.' + day;

  const loadStep = async (boardData) => {
    const total = {
      title: '전체',
      value: boardData.length,
      color: '#90EE90'
    }

    //****reduce 함수를 사용하면 배열의 각 요소를 순회하며 누적 계산을 실행
    const counts = boardData.reduce((acc, { Status }) => { 
      // Status 값이 null 또는 undefined일 경우를 대비하여 기본값을 설정
      const statusKey = (Status || '').toLowerCase(); // 기본값으로 빈 문자열을 사용
      acc.total += 1; // 전체 개수
      if (statusKey) { // statusKey가 빈 문자열이 아닐 경우에만 개수 증가
        acc[statusKey] = (acc[statusKey] || 0) + 1;
      }
      return acc;
    }, { 대기: 0, 진행중: 0, 완료: 0, 이슈: 0 });

    // 상태별 개수를 기반으로 newTable 생성
    const title = ['대기', '진행중', '완료', '이슈'];
    const newTable = title.map((status, index) => ({
      title: status,
      // statusKey가 빈 문자열인 경우(예: Status가 null) 0을 기본값으로 사용
      value: counts[status.toLowerCase()] || 0,
      color: colorStep[index],
    }));

    const resultData = [total, ...newTable];
    setTabStep(resultData);
  };

  const loadTap = async (boardData) => {
    // 'To Day' 항목 처리
    const toDayCard = {
      title: 'To Day',
      value: dateString,
      color: '#A7CCCB',
    };

    // 중복 제거하여 탭 생성 및 'To Day'를 제외한 나머지 탭의 데이터 처리
    const tabData = boardData.reduce((acc, { Name, Status }) => {
      // 탭이 이미 존재하면 해당 탭의 아이템 개수를 증가, 아니면 탭 추가
      if (!acc.find(tab => tab.title === Name)) {
        acc.push({
          title: Name,
          pm: pm === Name ? true : false,
          value: boardData.filter(item => item.Name === Name).length,
          color: '#A7CCCB', // 모든 탭에 대해 동일한 색상 사용
        });
      }
      return acc;
    }, []); // 'To Day' 카드를 초기값으로 설정

    const resultData = [toDayCard, ...tabData];
    await setTabData(resultData);
  };

  useEffect(() => {
    //console.log('업데이트', boardData);
    loadStep(boardData);
    loadTap(boardData);

  }, [boardData])


  return (
    <>
      <div className="stats-container mb-2 flex-wrap">
        {tabStep.map((card, index) => (
          <div key={index} className="stats-card" style={{ backgroundColor: card.color }}>
            <div className="card-title">{card.title}</div>
            <hr style={{ height: '3px', color: 'black' }}></hr>
            <div className="card-value" >{card.value}</div>
          </div>
        ))}
      </div>
      <div className="stats-container mb-2 flex-wrap">
        {tabData.map((card, index) => (
          <div key={index} className="stats-card" style={{ backgroundColor: card.color }}>
            <div className="card-title"><span style={{color: 'yellow'}}>{card.pm === true ? '★' : ''}</span>{card.title}</div>
            <hr style={{ height: '3px', color: 'black' }}></hr>
            <div className="card-value" >{card.value}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectStatus;