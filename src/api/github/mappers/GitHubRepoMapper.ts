import { GitHubRepoApiResponse, I18nMap, Locale, Project } from '../entities/Project';
import { IconService } from '../../../services/IconService';
import { ProjectContexts } from '../../../shared/constants';

export function mapGitHubReposToProjects(repos: GitHubRepoApiResponse[], i18nMap: I18nMap, locale: Locale): Project[]
{
    const iconService = new IconService();

    return repos.map(repo =>
    {
        const language = repo.language ?? "Not specified";
        const description = i18nMap[repo.name]?.[locale] ?? repo.description ?? "No description available.";
        const topics = repo.tags ?? [];
        const contextTopic = topics.find(topic => topic in ProjectContexts.LABELS);

        return {
            name: repo.name,
            owner: getOwnerFromUrl(repo.url),
            description,
            url: repo.url,
            imageUrl: repo.image ?? "No avatar available.",
            language,
            context: contextTopic ? ProjectContexts.LABELS[contextTopic][locale] : null,
            tags: topics.filter(topic => !topic.startsWith(ProjectContexts.TOPIC_PREFIX)),
            languageIconUrl: iconService.getLanguageIconUrl(language),
            versionControl: iconService.getVersionControlIconUrl(repo.url),
        };
    });
}

function getOwnerFromUrl(url: string): string
{
    try
    {
        return new URL(url).pathname.split("/").filter(Boolean)[0] ?? "";
    }
    catch
    {
        return "";
    }
}
