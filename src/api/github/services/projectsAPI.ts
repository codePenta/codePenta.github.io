import { FilePaths } from '../../../constants';
import { GitHubRepoApiResponse, Project } from '../entities/ProjectEntity';
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