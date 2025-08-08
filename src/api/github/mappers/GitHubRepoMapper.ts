import { GitHubRepoApiResponse, Project } from '../entities/ProjectEntity';

function mapToProject(repo: GitHubRepoApiResponse): Project
{
    return {
        name: repo.name,
        description: repo.description ?? "No description available.",
        url: repo.url,
        imageUrl: repo.image ?? "No avatar available.",
        language: repo.language ?? "Not specified",
    };
}

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[]): Project[]
{
    var mapped = repos.map(mapToProject);
    console.log(mapped);
    return mapped;
}