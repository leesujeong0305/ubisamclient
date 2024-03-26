import React, { useEffect } from 'react';
import './Today.css';

function Today(getData) {


    useEffect(() => {
        console.log('today', getData);


    }, [getData])
    
    
    return (
    <div className="todo-app">
        <header className="todo-header">ToDo List</header>
        <ul className="todo-list">
        {/* List items will be dynamically added here */}
        <div className='project-name'>프로젝트<div className='project'>{getData.getData.project}</div></div>
        
        <hr className='project-hr'/>
        <div className='project-name'>제목<div className='project'>{getData.getData.title}</div></div>
        
        <hr/>
        <div>{getData.getData.content}</div>
        
        </ul>
    </div>
    );
}

export default Today
