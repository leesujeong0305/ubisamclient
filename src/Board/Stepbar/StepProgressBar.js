import React from 'react';
import './StepProgressBar.css';

const StepProgressBar = ({ steps, currentStep }) => {
    return (
        <div className="step-progress-bar">
        {steps.map((step, index) => {
          let stepClass = 'step';
          if (index < currentStep || currentStep >= steps.length) {
            stepClass += ' completed'; // Mark all steps as completed if currentStep >= steps.length
          } else if (index === currentStep) {
            stepClass += ' current'; // The current step is in progress
          }
    
          // Optionally, if you want to mark the current step as completed upon submission
          if (currentStep === steps.length - 1) {
            stepClass += ' completed'; // This will mark all steps as completed
          }
    
          return (
            <div key={step.title} className={stepClass} style={{borderRadius: '20px'}}>
              <div className="step-title" style={{fontSize: '0.9rem'}}>{`Step ${index + 1}`}</div>
              <div className="step-description">{step.title}</div>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default StepProgressBar;