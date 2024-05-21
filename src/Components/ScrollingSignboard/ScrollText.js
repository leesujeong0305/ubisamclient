import React, { useEffect, useRef } from 'react';
import './ScrollText.css';

const ScrollText = ({ text }) => {
  const textWrapperRef = useRef(null);

  useEffect(() => {
    const textWrapper = textWrapperRef.current;
    const textLength = textWrapper.scrollWidth;
    const containerWidth = textWrapper.parentElement.offsetWidth;
    
    // 애니메이션 속도 조절을 위한 계산
    const duration = Math.max(10, (textLength / containerWidth) * 15); // 최소 15초로 비율 계산
    textWrapper.style.animation = `scroll ${duration}s linear infinite`;
  }, [text]);

  const repeatedText = [...text]; // 텍스트를 두 번 반복
  return (
    <div className="container-wrapper">
      <div className="text-wrapper" ref={textWrapperRef}>
        {repeatedText.map((task, index) => (
          <div key={index} className="text">
            {task.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollText;