import React, { useEffect, useState } from 'react';
import SearchBar from './TeamTodoList/SearchBar';
import AdminBulletin from './TeamTodoList/AdminBulletin';
import SelectItems from '../../MyCalendar/SelectItems';

const TeamTodoList = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [select, setSelect] = useState(new Set('전 체'));
  const [useSerch, setUseSerch] = useState(false);
  const [name, setName] = useState('');

  // 날짜를 "yyyy-MM-dd" 형식으로 변환하는 함수
  const formatDate = (dateString) => {
    let month = '' + (dateString.getMonth() + 1),
            day = '' + dateString.getDate(),
            year = dateString.getFullYear();
        
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
  };

  const handleData = (data) => {
    if (data === undefined)
      return;
    setUseSerch(data[0]);
    setStartDate(formatDate(data[1]));
    setEndDate(formatDate(data[2]));
    setName(data[3])
  }


  useEffect(() => {
  }, [])

  return (
   <div className="team-todo-list">
    <SearchBar handleData={handleData} />
    {select && <SelectItems select={select} setSelect={setSelect} isAdmin={true} />} {/* 검색기능과 개별로 동작되게  */}
    <AdminBulletin startDate={startDate} endDate={endDate} selectedCategory={select} useSerch={useSerch} name={name} />
  </div>
  );
};

export default TeamTodoList;