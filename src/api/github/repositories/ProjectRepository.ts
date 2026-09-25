import { GitHubRepoApiResponse, I18nMap, Locale, Project } from '../entities/Project';
import { fetchProjects } from '../services/projectsAPI';
import { mapGitHubReposToProjects } from '../mappers/GitHubRepoMapper';

export class ProjectRepository
{
    private rawProjects: GitHubRepoApiResponse[] = [];
    private i18nMap: I18nMap = {};
    private loaded = false;

    public async load(): Promise<void>
    {
        if (this.loaded) return;

        const data = await fetchProjects();
        this.rawProjects = data.rawProjects;
        this.i18nMap = data.i18nMap;
        this.loaded = true;
    }

    public getLocalisedProjects(locale: Locale): Project[]
    {
        return mapGitHubReposToProjects(this.rawProjects, this.i18nMap, locale);
    }
}