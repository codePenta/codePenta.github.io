import { displayGitHubRepositories } from "./services/api/github/githubService";

async function initializeWebComponents(): Promise<void>
{
    console.log("Initializing web components...");

    try
    {
        await displayGitHubRepositories();
        console.log("Web components initialized successfully.");
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