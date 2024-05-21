import React, { useState } from 'react'
import './ViewGitHistory.css'

function ViewGitHistory({selectedProjectName}) {
    const [path, setPath] = useState('');



    const handleGitConn = () => {

    };

    return (
        <div className="git-container">
            <div className="git-container-header">
                <input className='git-path' type="text" placeholder='프로젝트 Git주소'
                    value={path} onChange={(e) => setPath(e.target.value)}></input>
                <button className="add-button" onClick={handleGitConn}>Git 연결하기</button>
            </div>
            <div className='git-container-body'>
                <div>첫번째 히스토리</div>
            </div>
        </div>
    )
}

export default ViewGitHistory