import React from 'react';
import { FaArrowLeft, FaFileExport, FaStar, FaCodeBranch, FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';

function SearchResult({ results, searchParams, loadMoreResults, onBack, onExport, onCheckboxChange }) {
  return (
    <div className="results-container">
      <FaArrowLeft className="back-button" onClick={onBack} />
      <FaFileExport className="export-button" onClick={onExport} />

      <h2 className="results-header">Showing results...</h2>
      <p className="search-summary">You are searching for {searchParams.skills} skilled developers in {searchParams.location}</p>

      <div className="cards-container">
        {results.map((user, index) => (
          <div key={index} className="user-card">
            <div className="card-header">
              <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="avatar" />
              <h3>{user.name}</h3>
              <input
                type="checkbox"
                className="select-user"
                checked={user.selected}
                onChange={() => onCheckboxChange(index)}
              />
            </div>
            <div className="card-body">
              <p><FaStar /> {user.totalStars}</p>
              <p><FaCodeBranch /> {user.totalForks}</p>
              <p>
                <FaEnvelope />
                <a href={`mailto:${user.email}`} className="email-link">{user.email || 'Not available'}</a>
              </p>
              <p className={`hireable ${user.hireable ? 'yes' : 'no'}`}>
                {user.hireable ? <FaCheck /> : <FaTimes />} Hireable
              </p>
            </div>
            <div className="card-footer">
              <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="profile-link">View Profile</a>
            </div>
          </div>
        ))}
      </div>

      <button onClick={loadMoreResults} className="load-more">Show More</button>
    </div>
  );
}

export default SearchResult;
