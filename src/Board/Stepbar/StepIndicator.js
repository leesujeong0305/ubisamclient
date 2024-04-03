import React, { useEffect, useState } from 'react';
import './StepIndicator.css';

const steps = [
  { label: '대기', icon: '✓' },
  { label: '제작', icon: '✓' },
  { label: '셋업', icon: '✓' },
  { label: '완료', icon: '✓' },
];

function StepIndicator({status}) {
  const [currentStep, setCurrentStep] = useState(0);

  const isStepCompleted = (stepIndex) => stepIndex < currentStep;
  const isCurrentStep = (stepIndex) => stepIndex === currentStep;

  const goBack = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));
  const goNext = () => setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));

  useEffect(() => {
    //if (status !== 0) {
      setCurrentStep(status);
   // }
  }, [status])

  return (
    <div className="step-indicator-container">
      {/* 여기에 제목 표시줄 추가 */}
    <div className="title-bar">
      프로젝트 현황
    </div>
      <div className="steps">
        {steps.map((step, index) => (
          <div key={index} className={`step ${isCurrentStep(index) ? 'current' : ''}`}>
            <div className={`step-icon ${isStepCompleted(index) ? 'completed' : ''}`}>
              {isStepCompleted(index) ? step.icon : index + 1}
            </div>
            <div className="step-label">{step.label}</div>
            {index !== steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button onClick={goBack} disabled={currentStep === 0}> ◀️​​ </button>
        <button onClick={goNext} disabled={currentStep === steps.length - 1}>▶️​​</button>
      </div>
    </div>
  );
}

export default StepIndicator;