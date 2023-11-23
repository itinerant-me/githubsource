import React, { useState } from 'react';

function SearchForm({ onSearchSubmit }) {
  const [formData, setFormData] = useState({
    skills: '',
    location: '',
    stars: '',
    forks: '',
    token: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="skills" placeholder="Skills (e.g., React, Node.js)" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location (e.g., San Francisco)" onChange={handleChange} required />
      <input type="number" name="stars" placeholder="Minimum Stars" onChange={handleChange} />
      <input type="number" name="forks" placeholder="Minimum Forks" onChange={handleChange} />
      <textarea name="token" placeholder="GitHub Personal Access Token" onChange={handleChange} required rows="2"></textarea>
      <button type="submit">Fetch Results</button>
    </form>
  );
}

export default SearchForm;
