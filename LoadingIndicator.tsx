import React from "react";
import "./LoadingIndicator.css";

interface LoadingIndicatorProps {
  message: string;
  percentage: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, percentage }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <p className="loading-message">{message}</p>
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="loading-percentage">{Math.round(percentage)}%</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;