import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './Component/Header';
import Loader from './Component/Loader';
import Card from './Component/Card';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_API_URL;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

function App() {
  const [showData, setShowData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [whatShow, setWhatShow] = useState('MOVIES'); // MOVIES, SERIES, FAVORITE
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : []);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial fetch when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesData, seriesData] = await Promise.all([
          fetchPopularMovies(1),
          fetchPopularSeries(1),
        ]);
        setPopularMovies(moviesData);
        setPopularSeries(seriesData);
        setShowData(moviesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch more data when page changes
  useEffect(() => {
    if (page === 1) return;

    const fetchMoreData = async () => {
      try {
        setLoading(true);

        // Fetch data based on the current filter
        const newData = await (whatShow === 'MOVIES' ? fetchPopularMovies(page) : fetchPopularSeries(page));

        // Apply filtering before setting the state
        const filteredData = newData.filter(item => {
          const matchesGenre = !selectedGenre || item.genre_ids.includes(Number(selectedGenre));
          const matchesRating = !selectedRating || Math.floor(item.vote_average) === Number(selectedRating);
          return matchesGenre && matchesRating;
        });

        setShowData(prevData => [...prevData, ...filteredData]);
      } catch (error) {
        console.error(`Error fetching popular ${whatShow.toLowerCase()}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (whatShow !== "FAVORITE" && !searchTerm) {
      fetchMoreData();
    }
  }, [page, selectedGenre, selectedRating]);

  // Handle the scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const fetchPopularMovies = async (page) => {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        page: page,
      },
    });
    return response.data.results;
  };

  const fetchPopularSeries = async (page) => {
    const response = await axios.get(`${BASE_URL}/tv/on_the_air`, {
      params: {
        api_key: API_KEY,
        page: page,
      },
    });
    return response.data.results;
  };

  const handleGenreClick = (id) => {
    setSelectedGenre(prevId => {
      const newGenreId = prevId === id ? null : id;
      // Apply the filter based on the selected genre
      filterData(Number(newGenreId), Number(selectedRating));
      return newGenreId;
    });
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(prevRating => {
      const newRating = prevRating === rating ? null : rating;
      // Apply the filter based on the selected rating and current selected genre
      filterData(Number(selectedGenre), Number(newRating));
      return newRating;
    });
  };

  const filterData = (genreId, rating) => {
    let filteredData = showData;

    // Filter by genre if a genre is selected
    if (genreId) {
      filteredData = filteredData.filter(item => item.genre_ids.includes(genreId));
    }

    // Filter by rating if a rating is selected
    if (rating) {
      filteredData = filteredData.filter(item => Math.floor(item.vote_average) === rating);
    }

    // Check if filteredData is empty
    if (filteredData.length === 0) {
      // Determine the source of data based on whatShow value
      switch (whatShow) {
        case 'MOVIES':
          filteredData = popularMovies;
          break;
        case 'SERIES':
          filteredData = popularSeries;
          break;
        case 'FAVORITE':
          filteredData = favorites;
          break;
        default:
          filteredData = []; // No data available for unknown whatShow values
      }

      // Apply the same filters to the data from the selected source
      if (genreId) {
        filteredData = filteredData.filter(item => item.genre_ids.includes(genreId));
      }

      if (rating) {
        filteredData = filteredData.filter(item => Math.floor(item.vote_average) === rating);
      }
    }

    // Hide filters if filtered data is not empty
    if (filteredData.length > 0) {
      setShowFilters(false);
    }

    // Update the state with the filtered data
    setShowData(filteredData);
  };

  const handleFavClick = (item) => {

    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

    let updatedFavorites;

    // Check if the item is already in the favorites
    if (storedFavorites.some(favItem => favItem.id === item.id)) {
      // If it is, remove it from the favorites
      updatedFavorites = storedFavorites.filter(favItem => favItem.id !== item.id);
    } else {
      // If it isn't, add it to the favorites
      updatedFavorites = [...storedFavorites, item];
    }

    // Update the favorites in localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    // Optionally, update the state if you're using it to manage UI
    setFavorites(updatedFavorites);
    if (whatShow === "FAVORITE") {
      setShowData(updatedFavorites);
    }
  };

  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      // If the search term is empty, fetch the default data
      const data = await (whatShow === 'MOVIES' ? fetchPopularMovies() : fetchPopularSeries());
      setShowData(data);
      return;
    }

    try {
      let searchEndpoint;
      if (whatShow === 'FAVORITE') {
        // Fetch data from local storage
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const filteredFavorites = favorites.filter(item => item.title.toLowerCase().includes(term.toLowerCase()));
        setShowData(filteredFavorites);
      } else {
        // Determine the endpoint based on whatShow
        searchEndpoint = whatShow === 'MOVIES' ? '/search/movie' : '/search/tv';

        // Fetch data from API based on the search term
        const response = await axios.get(`${BASE_URL}${searchEndpoint}`, {
          params: {
            api_key: API_KEY,
            query: term,
          },
        });

        if (response.status === 200) {
          setShowData(response.data.results);
        } else {
          console.error('Search API returned non-200 status:', response.status);
          setShowData([]);
        }
      }
    } catch (error) {
      console.error(`Error searching ${whatShow.toLowerCase()}:`, error);
      setShowData([]);
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (text.length <= maxLength) {
      return text;
    }

    const truncated = text.slice(0, maxLength);
    // Ensure the truncation doesn't cut off a word in the middle
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    return lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) + '...' : truncated + '...';
  };


  return (
    <div className="App">

      {
        loading && <Loader />
      }

      <Header
        showSeries={() => { setWhatShow('SERIES'); setShowData(popularSeries); setShowFilters(false); setSelectedGenre(null); setSelectedRating(null); setSearchTerm('') }}
        showMovies={() => { setWhatShow('MOVIES'); setShowData(popularMovies); setShowFilters(false); setSelectedGenre(null); setSelectedRating(null); setSearchTerm('') }}
        showFav={() => { setWhatShow('FAVORITE'); setShowData(favorites); setShowFilters(false); setSelectedGenre(null); setSelectedRating(null); setSearchTerm('') }}
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />

      <div className="container">
        <div className="sectionTopMain">
          <div className="top">
            <h1 id="page-title">
              {searchTerm === "" ? whatShow : truncateText(searchTerm, 10)}
            </h1>
            {
              searchTerm === "" ? (
                <button
                  className='filters_btn'
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="filter-options"
                  aria-label="Toggle Filters"
                >
                  <span>Filters</span>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                    <path d="M456.18-192Q446-192 439-198.9t-7-17.1v-227L197-729q-9-12-2.74-25.5Q200.51-768 216-768h528q15.49 0 21.74 13.5Q772-741 763-729L528-443v227q0 10.2-6.88 17.1-6.89 6.9-17.06 6.9h-47.88ZM480-498l162-198H317l163 198Zm0 0Z" />
                  </svg>
                </button>
              ) : null
            }
          </div>

          {
            (showFilters && searchTerm === "") ?
              <div className="filter_options" aria-labelledby="filter-options-heading">
                <h5 id="filter-options-heading">Filter Options</h5>
                <div>
                  <h6>Select Genre:</h6>
                  <ul role="list">
                    {Object.entries(GENRE_MAP).map(([id, genreName]) => (
                      <li key={id}>
                        <button
                          className={`filterLinks ${selectedGenre === id ? 'active' : ''}`}
                          onClick={() => handleGenreClick(id)}
                          aria-pressed={selectedGenre === id}
                        >
                          {genreName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6>Select Rating (out of 10)</h6>
                  <ul role="list">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                      <li key={item}>
                        <button
                          className={`filterLinks ${selectedRating === item ? 'active' : ''}`}
                          onClick={() => handleRatingClick(item)}
                          aria-pressed={selectedRating === item}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              : null
          }


        </div>
        <div className="gridContainer">
          {showData && showData.length > 0 ? showData.map((item, index) => (
            <Card
              item={item}
              index={index}
              IMAGE_BASE_URL={IMAGE_BASE_URL}
              handleFavClick={handleFavClick}
            />
          )) : <p className='no_data_found'>{`No ${whatShow} Found`}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
