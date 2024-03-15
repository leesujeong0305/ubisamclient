import React from 'react';
import './ProjectStatus.css'; // Make sure to create a corresponding CSS file

const ProjectStatus = () => {
  const cards = [
    { title: 'To Day', value: '3.14', color: '#FFC0CB' },
    { title: '전체', value: '14.00' , color: '#CCCCFF'},
    { title: '대기', value: '14.00' , color: '#ADD8E6'},
    { title: '진행중', value: '11.25', color: '#FFD700'},
    { title: '완료', value: '14.00', color: '#90EE90'},
    { title: '이슈', value: '2.75', color: '#FFD9DF' },
  ];

  const info = [
    { title: '프로젝트진행', value: '+100일', color: '#A7B6CC'},//#B57351
    { title: '박동준', value: '10', color: '#A7CCCB'},
    { title: '최이근', value: '3', color: '#A7CCCB'},
    { title: '이수정', value: '5', color: '#A7CCCB'},
    { title: '홍길동', value: '0', color: '#A7CCCB'},
  ];

  return (
    <>
    <div className="stats-container mb-3">
      {cards.map((card, index) => (
        <div key={index} className="stats-card" style={{ backgroundColor: card.color} }>
          <div className="card-title">{card.title}</div>
          <hr style={{height: '3px', color:'black'}}></hr>
          <div className="card-value" >{card.value}</div>
        </div>
      ))}
    </div>
    <div className="stats-container mb-3">
      {info.map((card, index) => (
        <div key={index} className="stats-card" style={{ backgroundColor: card.color} }>
          <div className="card-title">{card.title}</div>
          <hr style={{height: '3px', color:'black'}}></hr>
          <div className="card-value" >{card.value}</div>
        </div>
      ))}
    </div>
    </>
  );
};

export default ProjectStatus;