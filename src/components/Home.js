import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import './Home.css';

const Home = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchDocs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/documents');
            setItems(response.data);
            if (response.data.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleSearch = debounce(async () => {
        try {
            console.log(`Sending search request with query: ${searchTerm}`);
            const response = await axios.get(`http://localhost:5000/api/search?query=${searchTerm}`);
            console.log('Search response:', response.data);
            setItems(response.data);
            setNoResults(response.data.length === 0);
        } catch (error) {
            console.error('Error searching data: ', error);
        }
    }, 500);
    

    useEffect(() => {
        fetchDocs();
    }, []);

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
            </div>
            <InfiniteScroll
                dataLength={items.length}
                next={handleSearch}
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
