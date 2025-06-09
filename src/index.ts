async function main()
{
    try
    {
        const { displayGitHubRepositories } = await import("./services/api/github/githubService");
        await displayGitHubRepositories();
    } catch (error)
    {
        console.error("Error in main function:", error);
    }
}

main();