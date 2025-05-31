import { Octokit } from "octokit";

const octokit: Octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN
});

async function main()
{
    try
    {
        const response = await octokit.request("GET /users/{username}/repos", {
            username: "codePenta",
            type: "all",
            per_page: 100,
            sort: "updated",
            direction: "desc"
        });
        const repos = response.data;
        console.log(`Found ${repos.length} repositories for user codePenta:`);
        repos.forEach((repo: { name: any; html_url: any; }) =>
        {
            console.log(`- ${repo.name}: ${repo.html_url}`);
        });
    } catch (error: any)
    {
        console.error("Error fetching repositories:", error);
    }
}

main();