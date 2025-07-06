import { RepoEntity } from "./api/entities/RepoEntity";
import { getGitHubRepositories } from "./services/api/github/githubService";
import { createProjectCard, loadProjects } from "./services/web/provider/githubProvider";

async function initializeWebComponents(): Promise<void>
{
    console.log("Initializing web components...");

    try
    {
        var repos = await getGitHubRepositories()
        console.log(repos);
        loadProjects(repos);
    }
    catch (error)
    {
        console.error("Error initializing web components:", error);
    }
}

function boostrap(): void
{
    console.log("Boostrap function called");
    document.addEventListener("DOMContentLoaded", () =>
    {
        console.log("DOM fully loaded and parsed");
        initializeWebComponents().catch((error) =>
        {
            console.error("Error during web components initialization:", error);
        });
    });

}

boostrap();