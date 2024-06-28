// src/components/SearchBar.js
import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchBar.css';
import ko from 'date-fns/locale/ko'; // 한국어 로케일을 임포트합니다.
registerLocale('ko', ko); // datepicker에 로케일을 등록합니다.

const SearchBar = ({handleData, tabs}) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedOption, setSelectedOption] = useState('');

  

  const handleSerch = () => {
    handleData([true, startDate, endDate, selectedOption]);
  }

  return (
    <div className="search-bar">
      <div>기간 검색</div>
      <DatePicker
        locale="ko"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="Start Date"
        className="date-picker"
        dateFormat="yyyy-MM-dd"
      />
      <span>-</span>
      <DatePicker
        locale="ko"
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="End Date"
        className="date-picker"
        dateFormat="yyyy-MM-dd"
      />
      <div>프로젝트</div>
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="dropdown"
      >
        {
          tabs && tabs.map((tab, index) => (
            <option key={index} value={tab}>{tab}</option>
          ))
        }
        
      </select>
      <div>검색</div>
      <input type="text" placeholder="내용입력" className="input-field" />
      <button className="search-button" onClick={handleSerch}>
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default SearchBar;