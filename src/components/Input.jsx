import React from 'react';
import './Input.css';

const Input = ({ label, error, className = '', type = 'text', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        type={type} 
        className={`input-field ${error ? 'is-invalid' : ''}`} 
        {...props} 
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export const TextArea = ({ label, error, count, maxCount, className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      <div className="label-row">
        {label && <label className="input-label">{label}</label>}
        {maxCount && (
          <span className={`char-count ${count > maxCount ? 'error' : ''}`}>
            {count}/{maxCount}
          </span>
        )}
      </div>
      <textarea 
        className={`input-field textarea-field ${error ? 'is-invalid' : ''}`} 
        {...props} 
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
