import { GitHubRepoApiResponse, Project } from '../entities/Project';
import { IconService } from '../../../services/IconService';

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[]): Project[]
{
    const iconService = new IconService();

    const languageNameMap: { [key: string]: string } = {
        'C#': 'csharp',
        'C++': 'cpp',
    };

    const mappedProjects = repos.map(repo =>
    {
        const rawLanguage = repo.language ?? "Not specified";

        const mappedLanguage = languageNameMap[rawLanguage] || rawLanguage;

        return {
            name: repo.name,
            description: repo.description ?? "No description available.",
            url: repo.url,
            imageUrl: repo.image ?? "No avatar available.",
            language: rawLanguage,
            languageIconUrl: iconService.getLanguageIconUrl(mappedLanguage),
            versionControl: iconService.getVersionControlIconUrl(repo.url),
        };
    });

    return mappedProjects;
}