import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import SearchFormModal from './components/SearchFormModal';
import SearchResult from './components/SearchResult';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(true);
  const [results, setResults] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [page, setPage] = useState(1);

  const fetchGitHubData = async (formData, newPage = 1) => {
    setShowModal(false);
    setSearchParams(formData);
    setPage(newPage);
    
    const perPage = 10;
    const query = `q=location:${encodeURIComponent(formData.location)}+language:${encodeURIComponent(formData.skills)}`
                  + `${formData.stars ? `+stars:>${formData.stars}` : ''}`
                  + `${formData.forks ? `+forks:>${formData.forks}` : ''}`
                  + `&sort=followers&per_page=${perPage}&page=${newPage}`;

    try {
      const searchResponse = await fetch(`https://api.github.com/search/users?${query}`, {
        headers: { 'Authorization': `token ${formData.token}` }
      });
      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }
      const searchData = await searchResponse.json();
      const userResults = await Promise.all(searchData.items.map(async user => {
        const userDetailResponse = await fetch(user.url, {
          headers: { 'Authorization': `token ${formData.token}` }
        });
        const userDetails = await userDetailResponse.json();

        const reposResponse = await fetch(userDetails.repos_url, {
          headers: { 'Authorization': `token ${formData.token}` }
        });
        const reposData = await reposResponse.json();

        let totalStars = 0;
        let totalForks = 0;
        reposData.forEach(repo => {
          totalStars += repo.stargazers_count;
          totalForks += repo.forks_count;
        });

        return {
          name: userDetails.login,
          avatarUrl: userDetails.avatar_url,
          profileUrl: userDetails.html_url,
          totalStars: totalStars,
          totalForks: totalForks,
          email: userDetails.email,
          hireable: userDetails.hireable,
          selected: false
        };
      }));

      setResults(prevResults => newPage === 1 ? userResults : [...prevResults, ...userResults]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const loadMoreResults = () => {
    const nextPage = page + 1;
    fetchGitHubData(searchParams, nextPage);
  };

  const handleBack = () => {
    setShowModal(true);
    setResults([]);
    setSearchParams({});
    setPage(1);
  };

  const onCheckboxChange = (index) => {
    setResults(results.map((item, i) => {
      if (i === index) return { ...item, selected: !item.selected };
      return item;
    }));
  };

  const handleExport = () => {
    const exportChoice = prompt("Enter your export choice: 'selected', 'all', or 'hireable'");
    let dataToExport = [];
    switch (exportChoice) {
      case 'selected':
        dataToExport = results.filter(item => item.selected);
        break;
      case 'hireable':
        dataToExport = results.filter(item => item.hireable);
        break;
      case 'all':
      default:
        dataToExport = results;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "exported_data.xlsx");
  };

  return (
    <div className="App">
      {showModal ? (
        <SearchFormModal onSearchSubmit={fetchGitHubData} />
      ) : (
        <>
          <SearchResult
            results={results}
            searchParams={searchParams}
            loadMoreResults={loadMoreResults}
            onBack={handleBack}
            onExport={handleExport}
            onCheckboxChange={onCheckboxChange}
          />
        </>
      )}
      <a 
      href="https://www.linkedin.com/in/victorchoudhary/"
      target="_blank" 
      rel="noopener noreferrer" 
      className="footer-link"
    >
      Created by: Victor C
    </a>
    </div>
  );
}

export default App;
