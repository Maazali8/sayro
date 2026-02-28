import React from 'react';
import './Slider.css';

const Slider = ({
    label,
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    minLabel,
    maxLabel,
    formatValue,
    className = '',
}) => {
    const displayValue = formatValue ? formatValue(value) : value;

    return (
        <div className={`slider-group ${className}`}>
            <div className="slider-label-row">
                <label className="slider-label">{label}</label>
                <span className="slider-value">{displayValue}</span>
            </div>
            <input
                type="range"
                className="slider-input"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
            {(minLabel || maxLabel) && (
                <div className="slider-track-labels">
                    {minLabel && <span>{minLabel}</span>}
                    {maxLabel && <span>{maxLabel}</span>}
                </div>
            )}
        </div>
    );
};

export default Slider;
