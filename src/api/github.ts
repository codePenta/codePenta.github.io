import { GitHubService } from "./services";

export async function fetchRepos()
{
    const octokit = GitHubService.Instance;

    const params: any = {
        username: import.meta.env.VITE_GITHUB_USERNAME!,
        type: "all",
        per_page: 100,
        sort: "updated",
        direction: "desc"
    };

    try
    {
        const response = await octokit.request("GET /users/{username}/repos", params);
        return response.data;
    } catch (error)
    {
        console.error("Error fetching repositories:", error);
        throw error;
    }
}