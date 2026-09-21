import { FilePaths } from '../../../shared/constants';
import { GitHubRepoApiResponse, Project } from '../entities/Project';
import { mapGitHubReposToProjects } from '../mappers/GitHubRepoMapper';

export async function fetchProjects(): Promise<Project[]>
{
    try
    {
        const response = await fetch(FilePaths.PROJECTS_DATA_PATH);

        if (!response.ok)
        {
            throw new Error(`Failed to load projects.json: ${response.status} ${response.statusText}`);
        }

        const rawProjects: GitHubRepoApiResponse[] = await response.json();
        return mapGitHubReposToProjects(rawProjects);
    } catch (error)
    {
        console.error("Error fetching projects from local JSON:", error);
        throw error;
    }
}

export async function fetchLanguagesFromProjects(rawProjects: Project[]): Promise<string>
{
    const languageNames = rawProjects.map(project => project.language);
    const uniqueLanguages = Array.from(new Set(languageNames));

    return JSON.stringify(uniqueLanguages, null, 2);
}