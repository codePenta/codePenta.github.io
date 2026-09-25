import { GitHubRepoApiResponse, I18nMap, Locale, Project } from '../entities/Project';
import { IconService } from '../../../services/IconService';

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[], i18nMap: I18nMap, locale: Locale): Project[]
{
    const iconService = new IconService();

    return repos.map(repo =>
    {
        const language = repo.language ?? "Not specified";
        const description = i18nMap[repo.name]?.[locale] ?? repo.description ?? "No description available.";

        return {
            name: repo.name,
            description,
            url: repo.url,
            imageUrl: repo.image ?? "No avatar available.",
            language,
            tags: repo.tags ?? [],
            languageIconUrl: iconService.getLanguageIconUrl(language),
            versionControl: iconService.getVersionControlIconUrl(repo.url),
        };
    });
}