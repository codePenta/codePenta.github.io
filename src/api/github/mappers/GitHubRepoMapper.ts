import { GitHubRepoApiResponse, Project } from '../entities/Project';
import { IconService } from '../../../services/IconService';

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[]): Project[]
{
    const iconService = new IconService();

    return repos.map(repo =>
    {
        const language = repo.language ?? "Not specified";

        return {
            name: repo.name,
            description: repo.description ?? "No description available.",
            url: repo.url,
            imageUrl: repo.image ?? "No avatar available.",
            language,
            tags: repo.tags ?? [],
            languageIconUrl: iconService.getLanguageIconUrl(language),
            versionControl: iconService.getVersionControlIconUrl(repo.url),
        };
    });
}