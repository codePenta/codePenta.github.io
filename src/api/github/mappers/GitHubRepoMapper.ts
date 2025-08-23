import { GitHubRepoApiResponse, Project } from '../entities/ProjectEntity';
import { IconService } from '../../../services/IconService';

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[]): Project[]
{
    const iconService = new IconService();
    const mappedProjects = repos.map(repo =>
    {
        const language = repo.language ?? "Not specified";
        return {
            name: repo.name,
            description: repo.description ?? "No description available.",
            url: repo.url,
            imageUrl: repo.image ?? "No avatar available.",
            language: language,
            languageIconUrl: iconService.getIconUrl(language.toLowerCase()),
        };
    });

    return mappedProjects;
}