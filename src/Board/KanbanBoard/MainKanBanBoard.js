import React, { useEffect, useState } from 'react';
import Axios from '../../API/AxiosApi';

import './KanBanBoardBody.css';

function MainKanBanBoard({ projectName, kanban }) {
    // 할 일 목록 상태를 관리합니다.
    const [tasks, setTasks] = useState([]);
    const [data, setData] = useState(false);

    // 새 할 일 텍스트 상태를 관리합니다.
    const [newTaskText, setNewTaskText] = useState('');

    // 드래그 중인 항목 상태를 관리합니다.
    const [draggedItem, setDraggedItem] = useState(null);

    const [issueOrder, setIssueOrder] = useState(0);
    const [compOrder, setCompOrder] = useState(0);

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
        console.log('변경', status, draggedIndex, updatedTasks);

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
        console.log('자리이동', draggedItem, finalIndex, updatedTasks);

        setTasks(updatedTasks);
        updataKanBanList_DB(draggedItem, status);
        setDraggedItem(null);
    };

    // 새 할 일을 추가합니다.
    const addNewTask = () => {
        if (!newTaskText.trim()) return;
        const newTask = {
            id: issueOrder + 1,
            text: newTaskText,
            status: 'issue',
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
        setIssueOrder(newTask.id);
        addKanBanList_DB(newTask);
        setNewTaskText('');
    };

    // 할 일을 삭제합니다.
    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const deleteAllTasks = () => {
        setTasks([]); // 모든 태스크 삭제
    };

    const loadKanBanList_DB = async () => {
        return await Axios.get(`http://localhost:8080/loadKanBanList?Project=${encodeURIComponent(projectName)}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            //console.log('getProject', { res });
            if (res.data) {
                console.log('kanban load', res.data);
                return res.data;
            } else if (res.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            console.log({ error });
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    }

    const addKanBanList_DB = (task) => {
        return Axios.post(`http://localhost:8080/addKanBanList`, {
            ProjectName: projectName,
            Content: task.text,
            Status: task.status,
            Order: 0,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
            } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    };

    const updataKanBanList_DB = (task, status) => {
        console.log('updataKanBanList', projectName);
        return Axios.post(`http://localhost:8080/updataKanBanList`, {
            Project: projectName,
            Content: task.text,
            Status: status,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            console.log({ response });
            if (response.status === 200) {
            } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");

            }
        }).catch(error => {
            //console.log({error});
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    }

    const loadKanBanList = async () => {
        const list = await loadKanBanList_DB(projectName);
        if (list.length > 0) {
            list.reverse().forEach((item, index) => {
                const newTask = {
                    id: index + 1, //`task-${Date.now()}`
                    text: item.Content,
                    status: item.Status,
                }
                setTasks(prevTasks => [...prevTasks, newTask]);
            })

            const num = list[list.length - 1];
            setIssueOrder(num.Order);
        }

    }

    useEffect(() => {
        deleteAllTasks();
        setIssueOrder(0);
        if (projectName !== "No Data")
            loadKanBanList();
    }, [kanban])

    useEffect(() => {
        deleteAllTasks();
        setIssueOrder(0);
        if (projectName !== "No Data")
            loadKanBanList();
    }, [projectName])

    // 컴포넌트 렌더링 부분입니다.
    return (
        <div className="kanban-board">
            {["issue"].map((status) => (
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
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
}

export default MainKanBanBoard;