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
    const [phaseCounts, setPhaseCounts] = useState({});

    const fetchDocs = async (page) => {
        try {
            const response = await axios.get('https://aaronle5621.pythonanywhere.com/api/documents?page=1');
            const newItems = response.data;

            if (page === 1) {
                setItems(newItems);
            } else {
                setItems((prevItems) => [...prevItems, ...newItems]);
            }

            if (newItems.length < 10) {
                setHasMore(false);
            }

            updatePhaseCounts(newItems);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const updatePhaseCounts = (newItems) => {
        const newPhaseCounts = { ...phaseCounts };

        newItems.forEach((item) => {
            const phase = item.phase;
            newPhaseCounts[phase] = (newPhaseCounts[phase] || 0) + 1;
        });

        setPhaseCounts(newPhaseCounts);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://aaronle5621.pythonanywhere.com/api/documents?page=1');
            setItems(response.data);
            setNoResults(response.data.length === 0);
            setHasMore(false);
            updatePhaseCounts(response.data);
        } catch (error) {
            console.error('Error searching data: ', error);
        }
    };

    const handleReset = async () => {
        setSearchTerm('');
        setPageNumber(1);
        setHasMore(true);
        setPhaseCounts({});
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
                    <>
                        <p>Phase Counts:</p>
                        <ul>
                            {Object.entries(phaseCounts).map(([phase, count]) => (
                                <li key={phase}>{`Phase ${phase}: ${count}`}</li>
                            ))}
                        </ul>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
