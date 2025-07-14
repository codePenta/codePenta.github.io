import { GitHubRepoApiResponse, Project } from '../entities/ProjectEntity';

export function mapGitHubRepoToProject(repo: GitHubRepoApiResponse): Project
{
    return {
        id: repo.name,
        name: repo.name,
        description: repo.description ?? "No description available.",
        url: repo.html_url,
        imageUrl: repo.owner?.avatar_url ?? "No avatar available.",
        tags: repo.topics || [],
        language: repo.language ?? "Unknown",
    };
}

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[]): Project[]
{
    return repos.map(mapGitHubRepoToProject);
}