import { fetchRepos } from "../../api/github";
import { RepoBlock } from "./repoBlock";

export async function displayGitHubRepositories()
{
    function displayRepoBlock(repo: RepoBlock): void
    {
        console.log('\n=== Repository Details ===');
        console.log(`Name: ${repo.owner.login}/${repo.name}`);
        console.log(`URL: ${repo.html_url}`);
        console.log(`Description: ${repo.description || "No description"}`);
        console.log(`Language: ${repo.language || "Not specified"}`);
        console.log(`Stats: ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | ⚠️ ${repo.open_issues_count}`);
        console.log(`Topics: ${repo.topics.length > 0 ? repo.topics.join(", ") : "No topics"}`);
        console.log(`Visibility: ${repo.private ? "🔒 Private" : "🌐 Public"}`);
        console.log(`License: ${repo.license ? repo.license.name : "No license"}`);
        console.log(`Created: ${new Date(repo.created_at).toLocaleDateString()}`);
        console.log(`Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
        console.log('========================\n');
    }

    let reposData = await fetchRepos() as unknown as RepoBlock[];

    if (reposData && reposData.length > 0)
    {
        reposData.forEach((repo) =>
        {
            displayRepoBlock(repo);
        });
    }
    else
    {
        console.log("No repositories found.");
    }

}