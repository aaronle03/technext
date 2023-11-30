import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <div className="filters">
                <h1>Search by Keyword, ID, or Publishing Date:</h1>
                <input type="search" id="site-search" name="q" />
                <button>Search</button>
            </div>
            <div className="main-section">
                <h1>Main Section</h1>
            </div>
        </div>
    )
}

export default Home