import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Home.css';

const Home = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);

    const fetchDocs = async (page) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/documents?page=${page}`);
            const newItems = response.data;

            // If it's the first page, set the items directly
            if (page === 1) {
                setItems(newItems);
            } else {
                // If it's not the first page, concatenate the new items to the existing ones
                setItems((prevItems) => [...prevItems, ...newItems]);
            }

            if (newItems.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleSearch = async () => {
        try {
            console.log(`Sending search request with query: ${searchTerm}`);
            const response = await axios.get(`http://localhost:5000/api/search?query=${searchTerm}`);
            console.log('Search response:', response.data);
            setItems(response.data);
            setNoResults(response.data.length === 0);
            setHasMore(false); // Disable infinite scroll for search results
        } catch (error) {
            console.error('Error searching data: ', error);
        }
    };

    const handleReset = async () => {
        setSearchTerm('');
        setPageNumber(1);
        setHasMore(true);
        fetchDocs(1);
    };

    useEffect(() => {
        fetchDocs(pageNumber);
    }, [pageNumber]);

    return (
        <div className="home">
            <div className="filters">
                <h1>Search by Keyword, ID, or Publishing Date:</h1>
                <input
                    type="search"
                    id="site-search"
                    name="q"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <InfiniteScroll
                dataLength={items.length}
                next={() => setPageNumber(pageNumber + 1)}
                hasMore={hasMore}
            ></InfiniteScroll>
            <div className="main-section">
                {noResults ? (
                    <p>No results found.</p>
                ) : (
                    <ul className="item-list">
                        {items.map((item) => (
                            <li key={item._id}>
                                <h2>Item ID: {item._id}</h2>
                                <p>Date: {item.Date}</p>
                                <p>Index: {item.idx}</p>
                                <p>Patent ID: {item.patent_id}</p>
                                <p>Patent Text: {item.patent_text}</p>
                                <p>Phase: {item.phase}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Home;