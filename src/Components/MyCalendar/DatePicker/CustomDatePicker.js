import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ExcelExport from '../../../db/Excel/ExcelExport';

import "react-datepicker/dist/react-datepicker.css";
import './CustomDatePicker.css';
import ko from 'date-fns/locale/ko'; // 한국어 로케일을 임포트합니다.

registerLocale('ko', ko); // datepicker에 로케일을 등록합니다.


const CustomDatePicker = ( {name, boardData} ) => {
    // 오늘 날짜를 구합니다.
    const today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(new Date(today));
    const [searchResults, setSearchResults] = useState(""); // 검색 결과를 저장할 상태 변수
    const [data, SetData] = useState([]);
    const [isReadyForExport, setIsReadyForExport] = useState(false); // ExcelExport 실행 준비 상태
    const [serchData, setSerchData] = useState([]);


    // 이번 달의 마지막 날을 구합니다.
    //const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 다음 달의 마지막 날을 구합니다.
    //const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 0, 0);

    // 오늘 날짜의 다음 날을 구합니다.
    // const tomorrow = new Date(today);
    // tomorrow.setDate(tomorrow.getDate() + 1);

    // 드롭박스에서 선택한 기간에 따라 endDate를 계산합니다.
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelectChange = (e) => {
        console.log("여기당",e.target.value);
        const value = e.target.value;
        setSelectedOption(value); // Set the selected option in the state
        const today = new Date();
        
        if (value === '1Day') {
            setStartDate(today);
            setEndDate(today);
        } else {
            let newStartDate = new Date(today);
    
            switch (value) {
                case '7Day':
                    newStartDate.setDate(today.getDate() - 7);
                    break;
                case '1months':
                    newStartDate.setMonth(today.getMonth() - 1);
                    break;
                case '3months':
                    newStartDate.setMonth(today.getMonth() - 3);
                    break;
                case '6months':
                    newStartDate.setMonth(today.getMonth() - 6);
                    break;
                case '1year':
                    newStartDate.setFullYear(today.getFullYear() - 1);
                    break;
                default:
                    newStartDate = today;
            }
    
            setIsReadyForExport(false);
            setStartDate(newStartDate);
            setEndDate(today); // Keep the end date as today for all options
            
        }
    };

    const handleDateChangeRaw = (e) => {
        e.preventDefault();
        console.log('handleDateChangeRaw',e.target.value);
      };

         // 검색 버튼 클릭 이벤트 핸들러
    const handleSearchClick = () => {
        // 날짜 포맷을 'yyyy/MM/dd' 형태로 지정
        const start = startDate.toLocaleDateString('ko-KR').replaceAll('. ', '/').replaceAll('.', '');
        const end = endDate.toLocaleDateString('ko-KR').replaceAll('. ', '/').replaceAll('.', '');

        // 결과를 상태 변수에 설정
        setSearchResults(`input1: ${start}, input2: ${end}`);
    };

    const formatDate = (date) => {
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();
        
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    const prepareDataForExport = async () => {
        // 필요한 데이터 처리 로직을 여기에 추가
        // 예: API 호출, 데이터 변환 등
        const start = formatDate(startDate);
        const end = formatDate(endDate);
        const filterData = data.filter(item => item.date >= start && item.date <= end )
        .map((item, index) => ({
            Index: index+1,
            Project: item.project,
            Date: item.date,
            Name: item.Name,
            Title: item.title,
            Content: item.content,
            Status: item.category,
        }));
        console.log('filterData',filterData);
        // 작업이 완료된 후 ExcelExport를 실행할 준비가 되었다는 신호를 상태에 저장
        setSerchData(filterData);
        setIsReadyForExport(true);
    };

    const handleExportClick = async () => {
        await prepareDataForExport(); // 먼저 실행할 작업
        // 작업 완료 후, ExcelExport 컴포넌트는 isReadyForExport 상태에 의해 렌더링됩니다.
    };

    useEffect(() => {
        console.log('CustomDatePicker', name, boardData);
        SetData(boardData);
    }, [boardData]);

    return (
        <div className="custom-date-picker">
            <select
                className="date-range-selector"
                onChange={handleSelectChange}
                value={selectedOption}
            >
                <option value="1Day"    disabled={selectedOption === "1Day"}>현재</option>
                <option value="7Day"    disabled={selectedOption === "7Day"}>7일</option>
                <option value="1months" disabled={selectedOption === "1months"}>1개월</option>
                <option value="3months" disabled={selectedOption === "3months"}>3개월</option>
                <option value="6months" disabled={selectedOption === "6months"}>6개월</option>
                <option value="1year"   disabled={selectedOption === "1year"}>1년</option>
            </select>
            {/* <DatePicker
                locale="ko" // locale 속성을 'ko'로 설정합니다.
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy/MM/dd"
            />
            <span>-</span>
            <DatePicker
                locale="ko" // locale 속성을 'ko'로 설정합니다.
                selected={endDate}
                onChange={date => setEndDate(date)}
                onChangeRaw={handleDateChangeRaw}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="yyyy/MM/dd"
            /> */}
            <DatePicker
                locale="ko" // locale 속성을 'ko'로 설정합니다.
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
            />
            <span>-</span>
            <DatePicker
                locale="ko" // locale 속성을 'ko'로 설정합니다.
                selected={endDate}
                onChange={date => setEndDate(date)}
                onChangeRaw={handleDateChangeRaw}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                dateFormat="yyyy-MM-dd"
            />
            <div>
            
            {isReadyForExport ? <ExcelExport data={serchData} name={name} /> : <button onClick={handleExportClick}>Serch</button>}
        </div>
            {/* 검색 결과를 보여주는 부분 */}
            <br></br>
            {searchResults && <div className="search-results">{searchResults}</div>}
        </div>
    );
};

export default CustomDatePicker;