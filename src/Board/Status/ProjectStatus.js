import React from 'react';
import './ProjectStatus.css'; // Make sure to create a corresponding CSS file

const ProjectStatus = () => {
  const cards = [
    { title: '전체', value: '14.00' , color: '#CCCCFF'},
    { title: '대기', value: '14.00' , color: '#ADD8E6'},
    { title: '진행중', value: '11.25', color: '#FFD700'},
    { title: '완료', value: '14.00', color: '#90EE90'},
    { title: '이슈', value: '2.75', color: '#FFC0CB' },
  ];

  const info = [
    { title: '총 갯수', value: '18', color: '#E9EFFF'},
    { title: '박동준', value: '10', color: '#E9EFFF'},
    { title: '최이근', value: '3', color: '#E9EFFF'},
    { title: '이수정', value: '5', color: '#90EE90'},
    { title: '홍길동', value: '0', color: '#FFC0CB' },
  ];

  return (
    <>
    <div className="stats-container mb-2">
      {cards.map((card, index) => (
        <div key={index} className="stats-card" style={{ backgroundColor: card.color} }>
          <div className="card-title">{card.title}</div>
          <hr style={{height: '4px'}}></hr>
          <div className="card-value" >{card.value}</div>
        </div>
      ))}
    </div>
    <div className="stats-container">
      {info.map((card, index) => (
        <div key={index} className="stats-card">
          <div className="card-title">{card.title}</div>
          <hr style={{height: '4px'}}></hr>
          <div className="card-value" >{card.value}</div>
        </div>
      ))}
    </div>
    </>
  );
};

export default ProjectStatus;