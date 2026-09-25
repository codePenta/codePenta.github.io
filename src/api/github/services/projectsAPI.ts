import { FilePaths } from '../../../shared/constants';
import { GitHubRepoApiResponse, I18nMap, ProjectsData } from '../entities/Project';

export async function fetchProjects(): Promise<ProjectsData>
{
    try
    {
        const [projectsResponse, i18nResponse] = await Promise.all([
            fetch(FilePaths.PROJECTS_DATA_PATH),
            fetch(FilePaths.PROJECTS_I18N_PATH),
        ]);

        if (!projectsResponse.ok)
        {
            throw new Error(`Failed to load projects.json: ${projectsResponse.status} ${projectsResponse.statusText}`);
        }

        if (!i18nResponse.ok)
        {
            throw new Error(`Failed to load projects.i18n.json: ${i18nResponse.status} ${i18nResponse.statusText}`);
        }

        const rawProjects: GitHubRepoApiResponse[] = await projectsResponse.json();
        const i18nMap: I18nMap = await i18nResponse.json();

        return { rawProjects, i18nMap };
    } catch (error)
    {
        console.error("Error fetching projects from local JSON:", error);
        throw error;
    }
}