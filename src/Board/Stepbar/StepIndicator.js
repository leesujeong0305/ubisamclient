import React, { useEffect, useState } from 'react';
import './StepIndicator.css';
import { UpdateStep } from '../../API/UpdateStep';

const steps = [
  { label: '대기', icon: '✓' },
  { label: '제작', icon: '✓' },
  { label: '셋업', icon: '✓' },
  { label: '완료', icon: '✓' },
];

function StepIndicator({ status, selectedProjectName }) {
  const [currentStep, setCurrentStep] = useState(0);

  const isStepCompleted = (stepIndex) => stepIndex < currentStep;
  const isCurrentStep = (stepIndex) => stepIndex === currentStep;

  const goBack = async () => {
    if (currentStep > 0) {
      UpdateStep(selectedProjectName, currentStep - 1);
    } else {
      UpdateStep(selectedProjectName, 0);
    }
    await setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));
    //UpdateStep(selectedProjectName, currentStep);
  }
  
  const goNext = async () => {
    if (currentStep < steps.length - 1) {
      UpdateStep(selectedProjectName, currentStep + 1);
    } else {
      UpdateStep(selectedProjectName, currentStep);
    }
    await setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    //UpdateStep(selectedProjectName, currentStep);
  }

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
      <div className='d-flex col'>

        <div className="buttons-container left">
          <button onClick={goBack} disabled={currentStep === 0}> ◀️​​ </button>
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
          <button onClick={goNext} disabled={currentStep === steps.length - 1}>▶️​​</button>
        </div>
      </div>
    </div>
  );
}

export default StepIndicator;