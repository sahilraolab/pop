import React from 'react';
import '../style/Card.css';

const Card = ({ item, index, IMAGE_BASE_URL, handleFavClick }) => {

    const isFavorite = (item) => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return storedFavorites.some(favItem => favItem.id === item.id);
    };

    return (
        <div className="card" key={index} role="article" aria-labelledby={`card-title-${index}`} aria-describedby={`card-description-${index}`}>
            <h2 id={`card-title-${index}`} className="text-center mt-2">
                <span>{item?.title || item?.name || item?.original_name || "Not found"}</span>
                <span>{item?.release_date?.split('-')?.[0] || item?.first_air_date?.split('-')?.[0] || "NA"}</span>
            </h2>
            <img
                src={`${IMAGE_BASE_URL}${item?.poster_path}`}
                alt={item?.title ? `${item.title} Poster` : 'Movie or TV Show Poster'}
                className="w-full h-auto"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "https://cdn.pixabay.com/photo/2016/12/14/23/08/page-not-found-1907792_1280.jpg";
                }}
            />
            <div className="btns">
                <div className="rating" aria-label={`Rating: ${item?.vote_average?.toFixed(1)}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                        <path d="m660-393 146-125 106 9-172 147 52 218-85-51-47-198Zm-87-265-43-99 46-107 92 214-95-8ZM304-293l128-76 129 76-34-144 111-95-147-13-59-137-59 137-147 13 112 95-34 144ZM195-144l63-266L48-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Zm237-323Z" />
                    </svg>
                    <span>{item?.vote_average?.toFixed(1) || "NA"}</span>
                </div>
                <button
                    className="fav"
                    onClick={() => handleFavClick(item)}
                    aria-label={isFavorite(item) ? "Remove from favorites" : "Add to favorites"}
                >
                    {isFavorite(item) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                            <path d="M734-313 615-432l51-51 68 68 136-136 51 51-187 187ZM432-480Zm0 360-108-96q-79-70-132-124t-85-99q-32-45-45.5-84.5T48-605q0-89 60.5-150T257-816q50 0 96.5 21t78.5 59q32.3-38.1 76.95-59.05Q553.6-816 603-816q78 0 136.5 47.5T812-648h-75q-14-42-50-69t-84-27q-57 0-87.5 28.5T452-648h-40q-34-40-65.5-68T257-744q-57 0-97 40t-40 99q0 31.37 12.5 63.68 12.5 32.32 47 75.82 34.5 43.5 95 103T432-217q25-22 73.5-65t68.5-62l8.05 8.05 17.45 17.45 17.45 17.45L625-293q-21 20-46 42t-41 36l-106 95Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M432-504Zm0 360-108-96q-79-70-132-124t-85-99q-32-45-45.5-84.5T48-629q0-89 60.5-150T257-840q50 0 96.5 21t78.5 59q32.3-38.1 76.95-59.05Q553.6-840 603-840q78 0 136.5 47.5T812-672h-75q-14-42-50-69t-84-27q-57 0-87.5 28.5T452-672h-40q-34-40-65.5-68T257-768q-57 0-97 40t-40 99q0 31.37 12.5 63.68 12.5 32.32 47 75.82 34.5 43.5 95 103T432-241q25-22 73.5-65t68.5-62l8.05 8.05 17.45 17.45 17.45 17.45L625-317q-21 20-46 42t-41 36l-106 95Zm300-168v-108H624v-72h108v-108h72v108h108v72H804v108h-72Z" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Card;
