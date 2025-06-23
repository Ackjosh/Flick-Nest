// src/routes/mediaRoutes.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
import axiosRetry from 'axios-retry'; // Import axios-retry

dotenv.config();

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
console.log('mediaRoutes.js - TMDB_API_KEY as seen by file:', TMDB_API_KEY ? 'Set (' + TMDB_API_KEY.length + ' chars)' : 'NOT SET'); // Keep this
console.log('mediaRoutes.js - First 5 chars of TMDB_API_KEY:', TMDB_API_KEY ? TMDB_API_KEY.substring(0, 5) : 'N/A');
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbRequestLimiter = pLimit(15); // Keep this at 15 for now, or slightly higher

// Configure axios to retry on network errors (like ECONNRESET) and 5xx errors
axiosRetry(axios, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
        // Exponential back-off delay
        return retryCount * 500; // 0.5s, 1s, 1.5s, etc.
    },
    retryCondition: (error) => {
        // Retry only on network errors (ECONNRESET, ETIMEOUT etc.) or 5xx HTTP codes
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
    },
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Retry attempt ${retryCount} for ${requestConfig.url}. Error: ${error.code || error.message}`);
    }
});

// Helper function to fetch single media details from TMDB
const fetchSingleMediaFromTMDB = async (mediaType, id) => {
    const url = `${TMDB_BASE_URL}/${mediaType}/${id}`;
    const response = await axios.get(url, {
        params: { api_key: TMDB_API_KEY }
    });
    return { ...response.data, media_type: mediaType };
};

// Helper function for browse/search content from TMDB
const fetchBrowseContentFromTMDB = async (query, page) => {
    let tmdbUrl = '';
    const params = { api_key: TMDB_API_KEY, page: page || 1 };

    if (query) {
        tmdbUrl = `${TMDB_BASE_URL}/search/multi`;
        params.query = query;
    } else {
        tmdbUrl = `${TMDB_BASE_URL}/trending/all/day`;
    }

    const response = await axios.get(tmdbUrl, { params });

    const filteredResults = response.data.results.filter(item =>
        item.media_type === 'movie' || item.media_type === 'tv'
    );

    const resultsWithMediaType = filteredResults.map(item => ({
        ...item,
        media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
    }));

    return {
        results: resultsWithMediaType,
        total_pages: response.data.total_pages || 1,
        page: response.data.page || 1
    };
};


// Route to fetch details for a single movie/TV show
router.get('/:mediaType/:id', async (req, res) => {
    const { mediaType, id } = req.params;

    // The TMDB_API_KEY check here is good, but the error happens even if it's "set" but malformed.
    if (!TMDB_API_KEY) {
        console.error("TMDB_API_KEY is not configured in mediaRoutes.js for /:mediaType/:id.");
        return res.status(500).json({ message: "Server API key not configured." });
    }
    if (!['movie', 'tv'].includes(mediaType)) {
        return res.status(400).json({ message: "Invalid media type. Must be 'movie' or 'tv'." });
    }

    try {
        // **ADD THESE CONSOLE.LOGS HERE**
        const url = `<span class="math-inline">\{TMDB\_BASE\_URL\}/</span>{mediaType}/${id}`;
        const params = { api_key: TMDB_API_KEY };
        console.log(`Attempting to fetch from TMDB: ${url}`);
        console.log('Params being sent to Axios:', params);

        const data = await tmdbRequestLimiter(() => fetchSingleMediaFromTMDB(mediaType, id));
        res.json(data);
    } catch (error) {
        console.error(`Error fetching ${mediaType} details for ID ${id}:`, error.message);
        // ... (rest of your error handling) ...
    }
});

// Route for fetching trending/popular content for the homepage or search results
router.get('/browse', async (req, res) => {
    const { query, page } = req.query;

    if (!TMDB_API_KEY) {
        console.error("TMDB_API_KEY is not configured in mediaRoutes.js for /browse.");
        return res.status(500).json({ message: "Server API key not configured." });
    }

    try {
        const data = await tmdbRequestLimiter(() => fetchBrowseContentFromTMDB(query, page));
        res.json(data);
    } catch (error) {
        console.error('Error fetching browse content:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Error fetching browse content due to network issue or TMDB problem.' });
    }
});

export default router;