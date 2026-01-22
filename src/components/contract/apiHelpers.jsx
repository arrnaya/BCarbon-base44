/**
 * API Helper Functions
 * Utility functions for fetching cached data from the new API
 */

import { API_BASE_URL, USE_CACHED_API, apihost } from './address';

/**
 * Fetch projects from cached API
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Projects data
 */
export async function fetchProjects(options = {}) {
    const {
        page = 1,
        limit = 10,
        status,
        methodology,
        owner,
        search
    } = options;

    const params = new URLSearchParams({
        page,
        limit,
        ...(status && { status }),
        ...(methodology && { methodology }),
        ...(owner && { owner }),
        ...(search && { search })
    });

    const endpoint = USE_CACHED_API
        ? `${API_BASE_URL}/projects?${params}`
        : `${apihost}/project/getallprojects?page=${page}&limit=${limit}`;

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
}

/**
 * Fetch single project details
 * @param {string} address - Project contract address
 * @returns {Promise<Object>} Project data
 */
export async function fetchProjectDetails(address) {
    if (!USE_CACHED_API) {
        // Fallback to old method
        const response = await fetch(`${apihost}/project/getproject/${address}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        return response.json();
    }

    const response = await fetch(`${API_BASE_URL}/projects/${address}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
}

/**
 * Fetch project minting history
 * @param {string} address - Project contract address
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Minting history
 */
export async function fetchProjectMints(address, page = 1, limit = 20) {
    const response = await fetch(
        `${API_BASE_URL}/projects/${address}/mints?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch mints');
    return response.json();
}

/**
 * Fetch project retirement history
 * @param {string} address - Project contract address
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Retirement history
 */
export async function fetchProjectRetirements(address, page = 1, limit = 20) {
    const response = await fetch(
        `${API_BASE_URL}/projects/${address}/retirements?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch retirements');
    return response.json();
}

/**
 * Fetch user portfolio
 * @param {string} address - User wallet address
 * @returns {Promise<Object>} Portfolio data
 */
export async function fetchUserPortfolio(address) {
    const response = await fetch(`${API_BASE_URL}/users/${address}/portfolio`);
    if (!response.ok) throw new Error('Failed to fetch portfolio');
    return response.json();
}

/**
 * Fetch user activity timeline
 * @param {string} address - User wallet address
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Activity data
 */
export async function fetchUserActivity(address, page = 1, limit = 20) {
    const response = await fetch(
        `${API_BASE_URL}/users/${address}/activity?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch activity');
    return response.json();
}

/**
 * Fetch user NFT holdings (compatible with old endpoint)
 * @param {string} address - User wallet address
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} NFT holdings
 */
export async function fetchUserNFTs(address, page = 1, limit = 10) {
    if (!USE_CACHED_API) {
        const response = await fetch(`${apihost}/user/nfts/${address}?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch NFTs');
        return response.json();
    }

    const response = await fetch(
        `${API_BASE_URL}/users/${address}/nfts?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch NFTs');
    return response.json();
}

/**
 * Fetch marketplace listings
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Listings data
 */
export async function fetchMarketplaceListings(options = {}) {
    const {
        page = 1,
        limit = 20,
        project,
        seller,
        active = true,
        minPrice,
        maxPrice
    } = options;

    const params = new URLSearchParams({
        page,
        limit,
        active,
        ...(project && { project }),
        ...(seller && { seller }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice })
    });

    const response = await fetch(`${API_BASE_URL}/marketplace/listings?${params}`);
    if (!response.ok) throw new Error('Failed to fetch listings');
    return response.json();
}

/**
 * Fetch platform analytics
 * @returns {Promise<Object>} Platform statistics
 */
export async function fetchPlatformAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics/platform`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
}

/**
 * Fetch leaderboard
 * @param {string} type - Leaderboard type (mints, retirements, volume, etc.)
 * @param {number} limit - Number of entries
 * @returns {Promise<Object>} Leaderboard data
 */
export async function fetchLeaderboard(type = 'mints', limit = 10) {
    const response = await fetch(
        `${API_BASE_URL}/analytics/leaderboard?type=${type}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
}

/**
 * Fetch time-series data for charts
 * @param {string} metric - Metric type (mints, retirements, sales)
 * @param {string} interval - Time interval (day, week, month)
 * @param {number} days - Number of days
 * @returns {Promise<Object>} Time-series data
 */
export async function fetchTimeSeries(metric = 'mints', interval = 'day', days = 30) {
    const response = await fetch(
        `${API_BASE_URL}/analytics/timeseries?metric=${metric}&interval=${interval}&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch time-series data');
    return response.json();
}

/**
 * Fetch recent platform activity
 * @param {number} limit - Number of activities
 * @returns {Promise<Object>} Recent activities
 */
export async function fetchRecentActivity(limit = 20) {
    const response = await fetch(
        `${API_BASE_URL}/analytics/recent-activity?limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch recent activity');
    return response.json();
}
