import React from 'react';

const SearchFilterBar = ({ onSearchChange, onFilterChange, placeholder, options = [] }) => (
  <div className="search-filter-bar">
    <input
      className="search-input"
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <select className="filter-select" onChange={(e) => onFilterChange(e.target.value)}>
      <option value="">All Statuses</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default SearchFilterBar;
