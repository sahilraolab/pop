import React, { useState } from 'react';
import '../style/Header.css';
import logo from '../logo.png';

const Header = ({ showSeries, showMovies, showFav, handleSearchChange, searchTerm}) => {
    const [activeLink, setActiveLink] = useState('MOVIES');

    const handleLinks = (title) => {
        setActiveLink(title);

        switch (title) {
            case 'MOVIES':
                showMovies();
                break;

            case 'SERIES':
                showSeries();
                break;

            case 'FAVORITE':
                showFav();
                break;

            default:
                break;
        }
    }

    return (
        <header className='header'>
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="search">
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#525252">
                    <path d="M796-121 533-384q-30 26-69.96 40.5Q423.08-329 378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z" />
                </svg>
                <label htmlFor="search" style={{display:"none"}}>Search movies or TV shows</label>
                <input type="text" name="search" id="search" maxLength={50} placeholder='Search movies or TV shows...'  value={searchTerm} onChange={handleSearchChange} />
            </div>
            <div>
                <nav className='nav'>
                    <ul className='mainLinksContainer'>
                        <button 
                            onClick={() => handleLinks('MOVIES')} 
                            className={`mainLinks ${activeLink === 'MOVIES' ? 'active' : ''}`}
                        >
                            Movies
                        </button>
                        <button 
                            onClick={() => handleLinks('SERIES')} 
                            className={`mainLinks ${activeLink === 'SERIES' ? 'active' : ''}`}
                        >
                            Series
                        </button>
                        <button 
                            onClick={() => handleLinks('FAVORITE')} 
                            className={`mainLinks ${activeLink === 'FAVORITE' ? 'active' : ''}`}
                        >
                            Favorite
                        </button>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
