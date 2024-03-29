// SelectItems.js
import React, { useEffect } from 'react';
import './SelectItems.css';

function SelectItems({ select, setSelect }) {
  const selectsOptions = [
    { name: '전 체', color: '#CCFFCC' },
    { name: '대 기', color: '#CCCCFF' },
    { name: '진행중', color: '#FFFFCC' },
    { name: '완 료', color: '#CCFFFF' },
    { name: '이 슈', color: '#FFCCFF' },
  ];

  const handleSelect = (sport) => {
    setSelect((prevSelectedSports) => {
      const updatedSelectedSports = new Set(prevSelectedSports);
      
      if (sport === '전 체') {
        if (updatedSelectedSports.has(sport)) {
          updatedSelectedSports.clear();
        } else {
          updatedSelectedSports.clear();
          updatedSelectedSports.add(sport);
        }
      } else {
        updatedSelectedSports.delete('전 체');
        if (updatedSelectedSports.has(sport)) {
          updatedSelectedSports.delete(sport);
        } else {
          updatedSelectedSports.add(sport);
        }
      }
       // Log the updated selected sports before the state is updated
    console.log('Updated selected sports:', Array.from(updatedSelectedSports));
      return updatedSelectedSports;
    });
  };

  useEffect(() => {
    handleSelect('전 체');
  }, [])

  return (
    <div className="select-container">
      <div className="select-grid">
        {selectsOptions.map((sel) => (
          <div
            key={sel.name}
            className={`select-item ${select.has(sel.name) ? 'selected' : ''}`}
            style={{ backgroundColor: sel.color }}
            onClick={() => handleSelect(sel.name)}
          >
            {sel.name}
            <span className="checkmark">
              {select.has(sel.name) ? '✓' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectItems;