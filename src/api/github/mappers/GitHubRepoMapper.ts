import { GitHubRepoApiResponse, Project } from '../entities/ProjectEntity';

function mapToProject(repo: GitHubRepoApiResponse): Project
{
    return {
        id: repo.name.replace("_", " "),
        name: repo.name,
        description: repo.description ?? "No description available.",
        url: repo.html_url,
        imageUrl: repo.owner?.avatar_url ?? "No avatar available.",
        tags: repo.topics || [],
        language: repo.language ?? "Not specified",
    };
}

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[]): Project[]
{
    return repos.map(mapToProject);
}