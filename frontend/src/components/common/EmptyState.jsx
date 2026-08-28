import React from 'react';

const EmptyState = ({ message, ctaText, onCtaClick }) => (
  <div className="empty-state">
    <div className="empty-icon">📭</div>
    <h3>No records found</h3>
    <p>{message}</p>
    {ctaText && <button className="btn btn-primary" style={{ width: 'auto' }} onClick={onCtaClick}>{ctaText}</button>}
  </div>
);

export default EmptyState;
