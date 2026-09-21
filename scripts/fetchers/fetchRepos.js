import { Fetcher } from './gitRepoFetcher.js';
import { RepoMapper } from '../processors/dataMapper.js';
import { ProjectsWriter } from '../generators/modules/fileWriter.js';

async function refreshProjects()
{
    const apiFetcher = new Fetcher();
    const response = await apiFetcher.fetchGitRepos();

    if (!response || !response.ok)
    {
        console.warn("Skipping repository refresh because GitHub data could not be fetched. Existing project data will be kept.");
        return;
    }

    const repos = await response.json();

    if (!Array.isArray(repos))
    {
        console.warn("GitHub API response was not an array. Keeping existing project data.");
        return;
    }

    const projects = new RepoMapper().mapToProject(repos);
    new ProjectsWriter().writeToJsonFile(projects);
}

refreshProjects().catch(err =>
{
    console.warn("Project refresh was skipped because the GitHub API request failed.", err.message);
});
