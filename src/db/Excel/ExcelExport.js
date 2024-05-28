import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
//import './Excel-Export.css'
import { Button } from 'react-bootstrap';
import CustomConfirmModal from './CustomConfirmModal';


function ExcelExport( { data, name, selectedProjectName } ) {

    const handleExport = () => {
         // 새 워크북을 생성하고 워크시트를 추가합니다
        
        if (selectedProjectName === 'No Data') {
            alert('프로젝트를 먼저 선택해주세요');
            return;
        }

        if (data.length <= 0) {
            alert('데이터가 없습니다.');
            return;
        }

        const wb = XLSX.utils.book_new();
        let newData = [];
        if (name === '전체')
        {
            newData = data.map((data, index) => ({
                ...data,
                Index: index + 1
            }));
        } else {
            newData = data.filter(data => data.Name === name)
                        .map((data, index) => ({
                            ...data,
                            Index: index + 1
                        }));
        }

        const ws = XLSX.utils.json_to_sheet(newData);
    
        // 워크시트를 워크북에 추가합니다
        //함수는 JSON 배열을 행과 열이 있는 워크시트로 변환합니다. JSON 개체의 키는 워크시트의 첫 번째 행에 있는 헤더가 되고, 해당 값은 해당 헤더 아래 셀에 배치됩니다.
        XLSX.utils.book_append_sheet(wb, ws, name);
    
        // 워크북을 작성하고 저장합니다
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
         // 이진 문자열을 ArrayBuffer로 변환합니다
        const buf = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < wbout.length; i++) {
        view[i] = wbout.charCodeAt(i) & 0xFF;
        }

         // 현재 날짜와 시간을 구합니다
        const date = new Date();
        //너무 길어도 줄바꿈을 사용할순없음 안그럼 제목에 여백이 생김(ex. 프로젝트_202403_        15_1043)
        //GPT : JavaScript에서 백틱(```)으로 감싼 템플릿 문자열 내에서 줄을 바꾸면, 실제 문자열에도 해당 줄바꿈과 공백이 포함됩니다
        const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;

        // 파일명에 날짜와 시간을 포함하여 저장합니다
        const filename = `${name}_${dateString}.xlsx`;
       
        // 파일로 저장합니다
        const blob = new Blob([buf], { type: 'application/octet-stream' });
        saveAs(blob, filename);
        
    };
    
    return (
      <>
        <Button
          className="custom-button"
          style={{ backgroundColor: "#66A593", display: "flex" }}
          onClick={handleExport}
        >
          <i className="bi bi-file-earmark-excel d-flex fs-5 justify-content-center" aria-hidden="true" />
          <div className="separator"></div>
          <span className="button-text">Excel Save</span>
          <div className="tooltip-text">TodoList 내용 Excel Save</div>
        </Button>
      </>
    );
};

export default ExcelExport