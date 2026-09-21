import { GITHB_API_URL, FETCH_TOKEN } from '../utils/constants.js'

export class Fetcher
{
    fetchGitRepos()
    {
        if (!FETCH_TOKEN)
        {
            console.warn("No GitHub token configured. Skipping repository refresh and keeping the existing local project data.");
            return Promise.resolve({ ok: false, status: 401, json: async () => ({}) });
        }

        return fetch(GITHB_API_URL, {
            headers:
            {
                'Authorization': `token ${FETCH_TOKEN}`
            }
        });
    }
}