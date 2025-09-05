import { GITHB_API_URL, FETCH_TOKEN } from '../utils/constants.js'

export class Fetcher
{
    fetchGitRepos()
    {
        const fetchedResult = fetch(GITHB_API_URL, {
            headers:
            {
                'Authorization': `token ${FETCH_TOKEN}`
            }
        })

        return fetchedResult;
    }
}