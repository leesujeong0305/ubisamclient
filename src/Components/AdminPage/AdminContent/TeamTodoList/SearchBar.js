// src/components/SearchBar.js
import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchBar.css';
import { useSelector } from 'react-redux';
import ko from 'date-fns/locale/ko'; // 한국어 로케일을 임포트합니다.
import { GetProjectInfo } from '../../../../API/GetProjectInfo';
registerLocale('ko', ko); // datepicker에 로케일을 등록합니다.

const SearchBar = ({ handleData }) => {
  const today = new Date();
  const { authUserId, authUserName, authUserRank, authUserTeam } = useSelector(state => state.userInfo);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedOption, setSelectedOption] = useState('');
  const [tabs, setTabs] = useState([]);
  const [refrsh, setRefresh] = useState(false);

  const Continents = [
    { key: '자동화1팀', value: '파주' },
    { key: '시스템사업팀', value: '구미' },
    { key: '장비사업팀', value: '서울' },
    { key: 'ReadOnly', value: '파주' },
  ];

  const selectSite = () => {
    if (authUserTeam === undefined)
      return;
    const found = Continents.find((item) => item.key === authUserTeam);
    return found ? found.value : undefined;
  }

  const handleProjectSerch = () => {
    handleData([true, undefined, undefined, selectedOption]);
    setRefresh(true);
  }

  const handleDateSerch = () => {
    handleData([true, startDate, endDate, undefined]);
    setRefresh(true);
  }

  const handleClear = () => {
    handleData([true, undefined, undefined, undefined]);
    setRefresh(false);
  }

  const LoadAllProjectInfo = async () => {
    const site = selectSite();
    const data = await GetProjectInfo("All", site);
    if (data === undefined)
      return;
    const dataWithIds = data.map((item, index) => ({
      id: index + 1, // id 필드 추가, 1부터 시작하는 고유한 값
      ...item
    }));
    return dataWithIds;
  }

  useEffect(() => {
    const allTabs = async () => {
      const filterTab = await LoadAllProjectInfo();
      //console.log('filterTab', filterTab);
      const allTabs = ['전체', ...new Set(filterTab.map(item => item.ProjectName))];
      setTabs(allTabs);
    };
    allTabs();
  }, [])

  return (
    <div className="search-bar d-flex">
      <div>
        <span>기간 검색</span>
        <DatePicker
          locale="ko"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          className="date-picker ms-1 me-1"
          dateFormat="yyyy-MM-dd"
        />
        <span>-</span>
        <DatePicker
          locale="ko"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          className="date-picker ms-1 me-1"
          dateFormat="yyyy-MM-dd"
        />
        <button className="search-button me-5" onClick={handleDateSerch}>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div>
        <span>프로젝트</span>
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
        <span>검색</span>
        <input type="text" placeholder="내용입력" className="input-field" />
        <button className="search-button" onClick={handleProjectSerch}>
          <i className="fas fa-search"></i>
        </button>
      </div>

      {
        refrsh && (
          <div className='clear-button'>
        <button className="search-button" onClick={handleClear}>
        <i class="bi bi-arrow-clockwise fs-6 fw-bolder"></i></button>
      </div>
        )
      }
      

    </div>
  );
};

export default SearchBar;