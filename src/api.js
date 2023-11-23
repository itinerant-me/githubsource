import axios from 'axios';

const BASE_URL = 'https://api.github.com';

export const fetchGitHubUsers = async (criteria, page = 1) => {
  const { skills, location, minStars, minForks, token } = criteria;
  let query = `${skills}+location:${location}`;

  const response = await axios.get(`${BASE_URL}/search/users?q=${query}&page=${page}&per_page=10`, {
    headers: { Authorization: `token ${token}` }
  });

  const users = response.data.items;
  const detailedUsers = await Promise.all(users.map(user => getUserDetails(user.login, token)));

  return detailedUsers.filter(user => user.totalStars >= minStars && user.totalForks >= minForks);
};

const getUserDetails = async (username, token) => {
  const userDetailsResponse = await axios.get(`${BASE_URL}/users/${username}`, {
    headers: { Authorization: `token ${token}` }
  });
  const userReposResponse = await axios.get(`${BASE_URL}/users/${username}/repos`, {
    headers: { Authorization: `token ${token}` }
  });

  const userDetails = userDetailsResponse.data;
  const repos = userReposResponse.data;

  const totalStars = repos.reduce((acc, repo) => !repo.fork ? acc + repo.stargazers_count : acc, 0);
  const totalForks = repos.reduce((acc, repo) => !repo.fork ? acc + repo.forks_count : acc, 0);

  return {
    username: userDetails.login,
    profileUrl: userDetails.html_url,
    totalStars,
    totalForks,
    email: userDetails.email || "No email publicly found",
    hireable: userDetails.hireable ? "Yes" : "Found no evidence"
  };
};
