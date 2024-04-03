import React, { useState } from 'react';
import StepProgressBar from './StepProgressBar';
import './StepStepMain.css';

function StepStepMain() {
  const steps = [
      { title: '' },
      { title: '' },
      { title: '' },
      { title: '' }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goForward = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    alert('Submit!');
    // Set the currentStep to the steps.length to indicate completion
    setCurrentStep(steps.length);
  };

  return (
    <div className="main-step">
      <StepProgressBar steps={steps} currentStep={currentStep} />
      <div className="buttons">
        <button className='step-button' onClick={goBack} disabled={currentStep === 0}>Back</button>
        <div style={{ flex: 1 }}></div>
        {currentStep < steps.length ? (
          <button className='step-button' onClick={goForward}>Next</button>
        ) : (
          <button className='step-button' onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
}

export default StepStepMain;