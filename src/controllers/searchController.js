import * as searchService from '../services/searchService.js';

export async function searchForQuery(req, res) {
    try {
        const result = await searchService.searchForQuery(req.query.q);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}