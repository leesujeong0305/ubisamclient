// src/components/Layout.js
import React, { useState, Suspense, lazy, useEffect } from 'react';
import Header from './AdminHeader';
import Sider from './AdminSider';
import Content from './AdminContent';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [headerTitle, setHeaderTitle] = useState(''); // 새로운 상태 추가

  const toggleSidebar = () => {
    //console.log('토글 사이드바 상태 이전:', isCollapsed);
    setCollapsed(!isCollapsed);
    //console.log('토글 사이드바 상태 이후:', !isCollapsed);
  };

  const loadComponent = (componentName) => {
    //console.log(`컴포넌트 로드 시도: ${componentName}`);
    switch (componentName) {
      case 'TeamTodoList':
        return lazy(() => import('./AdminContent/TeamTodoList'));
      case 'ProjectManager':
        return lazy(() => import('./AdminContent/ProjectManager'));
      case 'UserProfile':
        return lazy(() => import('./AdminContent/UserProfile'));
      default:
        console.log('알 수 없는 컴포넌트:', componentName);
        return null;
    }
  };

  const handleItemClick = (componentName) => {
    //console.log(`아이템 클릭: ${componentName}`);
    const Component = loadComponent(componentName);
    if (Component) {
      setActiveComponent(() => Component);
      setHeaderTitle(componentName); // 헤더 제목 설정
      console.log(`컴포넌트 설정 완료: ${componentName}`);
    } else {
      console.log('컴포넌트 설정 실패');
    }
  };

  useEffect(() => {
    handleItemClick('TeamTodoList');
  }, []);


  // react 컴포넌트를 동적으로 로드할 때, Suspense와 lazy를 사용하면서 발생하는 문제 중 하나는 동적으로 로드된 컴포넌트를 JSX에서 직접 사용하면 안 된다는 점입니다. 대신에, 동적으로 로드된 컴포넌트를 JSX에서 컴포넌트로 사용해야 합니다.
  // activeComponent를 JSX로 사용하려고 하면 컴포넌트로 인식되지 않기 때문에 화면에 아무것도 나타나지 않습니다. 대신, 컴포넌트를 변수로 사용하고 이를 JSX로 렌더링하는 방식으로 수정해야 합니다.

  const ActiveComponent = activeComponent;

  return (
    <div className={`layout ${isCollapsed ? 'collapsed' : ''}`}>
      <Header title={headerTitle} /> {/* 헤더 제목 전달 */}
      <Sider isCollapsed={isCollapsed} onToggle={toggleSidebar} onItemClick={handleItemClick} />
      <Content>
        <Suspense fallback={<div>로딩 중...</div>}>
          {ActiveComponent && <ActiveComponent />}
        </Suspense>
      </Content>
    </div>
  );
};

export default AdminLayout;