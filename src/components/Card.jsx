import React from 'react';
import './Card.css';

const Card = ({ children, title, description, footer, className = '', ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {(title || description) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {description && <p className="card-description">{description}</p>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

export default Card;
