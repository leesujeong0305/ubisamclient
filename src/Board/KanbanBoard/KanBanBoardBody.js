import React, { useState } from 'react';
import './KanBanBoardBody.css';

function KanBanBoardBody() {
  // 할 일 목록 상태를 관리합니다.
  const [tasks, setTasks] = useState([
    { id: 'task-1', text: 'Learn React', status: 'issue' },
    { id: 'task-2', text: 'Read a book', status: 'issue' },
    { id: 'task-3', text: 'Write an essay', status: 'complete' },
  ]);

  // 새 할 일 텍스트 상태를 관리합니다.
  const [newTaskText, setNewTaskText] = useState('');

  // 드래그 중인 항목 상태를 관리합니다.
  const [draggedItem, setDraggedItem] = useState(null);

  // 드래그 시작 시 호출됩니다.
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  // 드래그 오버 시 호출됩니다.
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 드롭 시 호출됩니다.
  const handleDrop = (e, status) => {
    e.preventDefault();
  
    const updatedTasks = [...tasks];
    const draggedIndex = tasks.findIndex(task => task.id === draggedItem.id);
    updatedTasks.splice(draggedIndex, 1); // 원래 위치에서 항목을 제거합니다.
  
    let finalIndex = tasks.length; // 특정 드롭 대상이 없으면 목록의 끝을 기본값으로 사용합니다.
  
    // 드롭 대상 인덱스를 찾습니다.
    const dropTarget = e.target.closest('.task-item');
    if (dropTarget) {
      const dropTargetId = dropTarget.getAttribute('data-id');
      const dropTargetIndex = tasks.findIndex(task => task.id === dropTargetId);
  
      // 드롭 위치가 타겟 요소의 중앙 이상인지 이하인지 결정합니다.
      const dropTargetRect = dropTarget.getBoundingClientRect();
      const dropTargetMiddleY = dropTargetRect.top + dropTargetRect.height;
      const isDropAboveMiddle = e.clientY < dropTargetMiddleY;
  
      // 드롭 위치에 따라 새로운 인덱스를 조정합니다.
      finalIndex = isDropAboveMiddle ? dropTargetIndex : dropTargetIndex + 1;
    }
  
    // 새 위치에 항목을 삽입합니다.
    updatedTasks.splice(finalIndex, 0, { ...draggedItem, status: status });
  
    setTasks(updatedTasks);
    setDraggedItem(null);
  };

  // 새 할 일을 추가합니다.
  const addNewTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskText,
      status: 'issue',
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskText('');
  };

  // 할 일을 삭제합니다.
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // 컴포넌트 렌더링 부분입니다.
  return (
    <div className="kanban-board">
      <div className="task-input-area">
        <div className="column-title-input">이슈 입력</div> {/* Moved here from the second column */}
        <div className="input-wrapper">
          <textarea 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="내용을 입력해주세요!"
            className="new-task-input"
          />
        </div>
        <button onClick={addNewTask} className="add-task-btn">
          등 록
        </button>
      </div>
      {["issue", "complete"].map((status) => (
        <div
          key={status}
          className={`task-column ${status}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h3 className="column-title">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </h3>
          {tasks
            .filter((task) => task.status === status)
            .map((task, index) => (
              <div
                key={task.id}
                data-id={task.id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, task)}
                className="task-item"
              >
                {task.text}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-task-btn"
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default KanBanBoardBody;