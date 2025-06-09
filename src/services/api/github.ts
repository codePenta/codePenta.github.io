import { GitHubService } from "../../api/services";
import { fetchRepos } from "../../api/github";

export async function displayGitHubRepositories()
{
    let reposData = await fetchRepos();
    if (reposData && reposData.length > 0)
    {
        console.log(`Found ${reposData.length} repositories:`);
        reposData.forEach((repo: { name: string; html_url: string; }) =>
        {
            console.log(`- ${repo.name}: ${repo.html_url}`);
        });
    }
    else
    {
        console.log("No repositories found.");
    }

}