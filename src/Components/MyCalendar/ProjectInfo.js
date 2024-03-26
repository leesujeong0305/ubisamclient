import './ProjectInfo.css';

function ProjectInfo(props) {
    return (
    <div className="todo-app">
        <header className="todo-header">{props.name}</header>
        <ul className="todo-list">
        </ul>
    </div>
    );
}

export default ProjectInfo
