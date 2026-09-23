const API_URL = "https://api.github.com/user/repos?visibility=public&affiliation=owner&per_page=100";

export async function fetchPublicRepos(token)
{
    const response = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });

    if (!response.ok)
        throw new Error(`GitHub API responded with ${response.status}`);

    return response.json();
}