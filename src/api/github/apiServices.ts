import { Octokit } from "octokit";
import { author, version } from "../../../package.json";

/**
 * GitHubService provides access to the Octokit instance.
 * It ensures that only one instance of Octokit is created and reused throughout the application.
 * This is useful for managing API rate limits and maintaining a single point of configuration for GitHub API interactions.
 */
export class GitHubService
{
    private static octokitInstance: Octokit;

    private constructor()
    {
        // Private constructor to prevent instantiation
    }

    public static get Instance(): Octokit
    {
        if (!this.octokitInstance)
        {
            console.log("Creating new Octokit instance.");
            this.octokitInstance = new Octokit({
                auth: import.meta.env.VITE_GITHUB_TOKEN,
                userAgent: `${author.name}/${version}`,
                baseUrl: "https://api.github.com",
                log: {
                    debug: console.debug,
                    info: console.info,
                    warn: console.warn,
                    error: console.error
                }
            });
        } else
        {
            console.log("Using existing Octokit instance.");
        }

        return this.octokitInstance;
    }
}