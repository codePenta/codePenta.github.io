import { GitHubRepoApiResponse, Project } from '../entities/ProjectEntity';
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
        console.log(mappedLanguage);

        return {
            name: repo.name,
            description: repo.description ?? "No description available.",
            url: repo.url,
            imageUrl: repo.image ?? "No avatar available.",
            language: rawLanguage,
            languageIconUrl: iconService.getIconUrl(mappedLanguage),
        };
    });

    return mappedProjects;
}