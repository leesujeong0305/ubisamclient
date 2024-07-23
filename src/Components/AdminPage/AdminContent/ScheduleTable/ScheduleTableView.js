import React, { useEffect, useRef } from 'react';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import gantt from 'dhtmlx-gantt';
import './ScheduleTableView.css'; // Import the CSS file
import ganttLocale from './ganttLocale'; // 새로운 locale 설정 파일을 import

const ScheduleTableView = ({ data, onDataUpdate }) => {
    const ganttContainer = useRef(null);
    
    useEffect(() => {
      // locale 설정 적용
      gantt.locale = ganttLocale;

      // 스케일 구성 설정
      gantt.config.scales = [
        { unit: "month", step: 1, format: "%F, %Y" },
        {
          unit: "day",
          step: 1,
          format: "%d",
          css: function (date) {
            if (date.getDay() === 0 || date.getDay() === 6) {
              return "week-end";
            } else {
              return "week-day";
            }
          },
        },
      ];
      gantt.config.inherit_scale_class = true;

      // 헤더 높이 설정
      gantt.config.scale_height = 60;
      gantt.config.min_column_width = 18; // 최소 컬럼 너비

      // 링크 선 비활성화
      gantt.config.show_links = false;

      // 세로 간격 설정
      gantt.config.row_height = 25; // 행 높이 조절
      gantt.config.bar_height = 17; // 막대 높이 조절

      gantt.templates.task_class = function (start, end, task) {
        return "gantt-bar";
      };

      gantt.init(ganttContainer.current);

      gantt.parse(data); // props로 받은 데이터 사용

      // 이벤트 핸들러 등록
      const handleTaskUpdate = () => {
        // 부모 ID를 기준으로 자식 인덱스를 관리하기 위한 맵
        const parentTaskIndexMap = {};
        
        // 부모가 없는 경우의 인덱스 초기화
        let parentNotIndex = 0;
        
        // Gantt 데이터를 직렬화하고 각 작업의 ID를 설정하는 단계
        let serializedData = gantt.serialize().data.map((task, index) => {
          let updatedTask;
          
          if (task.parent) {
            // 부모 ID에 대한 현재 자식 인덱스 가져오기 (없으면 0)
            const parentIndex = parentTaskIndexMap[task.parent] || 0;
            // 자식 인덱스를 1 증가시키고, 이를 새로운 ID로 설정
            const subTaskIndex = parentIndex + 1;
            parentTaskIndexMap[task.parent] = subTaskIndex; // 자식 인덱스 업데이트

            // 업데이트된 태스크
            updatedTask = {
              id: `${task.parent}_${subTaskIndex}`, // 부모 ID_자식 인덱스 형식
              text: task.text,
              start_date: task.start_date,
              duration: task.duration,
              parent: task.parent,
              progress: task.progress,
              open: true,
            };
          } else {
            // 부모가 없는 경우
            parentNotIndex += 1; // 인덱스를 1 증가
            updatedTask = {
              id: parentNotIndex, // 인덱스를 ID로 사용
              text: task.text,
              start_date: task.start_date,
              duration: task.duration,
              parent: task.parent,
              progress: task.progress,
              open: true,
            };
          }
          //console.log("Updated Task:", updatedTask);
          return updatedTask;
        });

        console.log("Serialized Data after ID adjustment:", serializedData);

        onDataUpdate({
          data: serializedData, // 조정된 데이터를 업데이트
          links: gantt.serialize().links, // 링크 데이터를 그대로 유지
        });
      };

      gantt.attachEvent("onAfterTaskAdd", handleTaskUpdate);
      gantt.attachEvent("onAfterTaskUpdate", handleTaskUpdate);
      gantt.attachEvent("onAfterTaskDelete", handleTaskUpdate);

      // Cleanup on unmount
      return () => {
        gantt.clearAll();
      };
    }, [data, onDataUpdate]);

    return (
       <div className="gantt-chart">
            <div ref={ganttContainer} className="gantt-container"></div>
        </div>
    );
};

export default ScheduleTableView;
