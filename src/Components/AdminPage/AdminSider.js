import React from 'react';
import './AdminSider.css';

const AdminSider = ({ isCollapsed, onToggle, onItemClick, authUserTeam }) => {
  return (
    <div className={`sider ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sider-item" onClick={() => onItemClick('TeamTodoList')}>
        <i className="fas fa-desktop"></i> {!isCollapsed && 'Team TodoList'}
      </div>
      <div className="sider-item" onClick={() => onItemClick('ProjectManager')}>
        <i className="fas fa-chart-pie"></i> {!isCollapsed && 'Project Manager'}
      </div>
      <div className="sider-item" onClick={() => onItemClick('TeamProject')}>
        <i className="fas fa-users"></i> {!isCollapsed && 'Team Project'}
      </div>
      {/* <div className="sider-item" onClick={() => onItemClick('ProjectDay')}>
        <i className="fas fa-file"></i> {!isCollapsed && 'Project Day'}
      </div> */}
      {
        authUserTeam !== 'ReadOnly' && (
          <div className="sider-item" onClick={() => onItemClick('UserProfile')}>
            <i className="fas fa-user"></i> {!isCollapsed && 'User'}
          </div>
        )
      }
      <div className="sider-item" onClick={onToggle}>
        <i className={`fas fa-arrow-${isCollapsed ? 'right' : 'left'}`}></i> {!isCollapsed && '최소화'}
      </div>
    </div>
  );
};

export default AdminSider;