// API key for themoviedb.org
const apiKey = 'b1466d721396f805c62744ad154b96d8';

// Get elements from the DOM
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const suggestionsContainer = document.getElementById('suggestions-container');
const recentSearchesContainer = document.getElementById('recent-searches-container');
const searchType = document.getElementById('search-type');

// Event listener for search button click
searchButton.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  const type = searchType.value;
  if (query) {
    suggestionsContainer.classList.add('hidden');
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayResults(data.results);
      addRecentSearch(query);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
});

// Event listener for search input change
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    const type = searchType.value;
    if (query) {
        suggestionsContainer.classList.remove('hidden')
      const url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        displaySuggestions(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
        suggestionsContainer.classList.add('hidden');
      suggestionsContainer.innerHTML = '';
    }
});

// Function to display search results
function displayResults(results) {
    resultsContainer.innerHTML = '';
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
      for (const result of results) {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-div');
        const posterBaseUrl = 'https://image.tmdb.org/t/p/';
        const posterSize = 'w200';
        const posterUrl = result.poster_path ? posterBaseUrl + posterSize + result.poster_path : 'https://via.placeholder.com/200x300?text=No+Image';
        const title = result.title || result.name; 
        const releaseDate = result.release_date || result.first_air_date; 
  
        movieDiv.innerHTML = `
            <h3>${title}</h3>
            <img src="${posterUrl}" alt="${title} Poster">
            <p>Release Date: ${releaseDate}</p>
        `;
        resultsContainer.appendChild(movieDiv);
      }
    }
}

// Function to display search suggestions
function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    const maxSuggestions = 5;
  
    let displayedSuggestions = 0;
    for (let i = 0; i < suggestions.length && displayedSuggestions < maxSuggestions; i++) {
      const suggestion = document.createElement('div');
      const title = suggestions[i].title || suggestions[i].name;
      if (title) {
        suggestion.classList.add('suggestion');
        suggestion.textContent = title;
        suggestion.addEventListener('click', () => {
          searchInput.value = title;
          suggestionsContainer.innerHTML = '';
        });
        suggestionsContainer.appendChild(suggestion);
        displayedSuggestions++;
      }
    }
}

// Function to add recent search query
function addRecentSearch(query) {
    try {
      const maxRecentSearches = 3;
      const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
if (!searches.includes(query)) {
searches.unshift(query);
if (searches.length > maxRecentSearches) {
searches.pop();
}
localStorage.setItem('recentSearches', JSON.stringify(searches));
displayRecentSearches();
}
} catch (error) {
console.error('Error adding recent search:', error);
}
}

// Function to display recent searches
function displayRecentSearches() {
recentSearchesContainer.innerHTML = '<h3>Recent Searches:</h3>';
const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
const maxRecentSearches = 3;
for (let i = 0; i < Math.min(maxRecentSearches, searches.length); i++) {
    const searchDiv = document.createElement('div');
    searchDiv.classList.add('recent-search');
    searchDiv.textContent = searches[i];
    searchDiv.addEventListener('click', () => {
      searchInput.value = searches[i];
      searchButton.click();
    });
    recentSearchesContainer.appendChild(searchDiv);
  }
}

// Display recent searches on page load
displayRecentSearches();
  
