import { Fetcher } from './gitRepoFetcher.js';
import { RepoMapper } from '../processors/dataMapper.js';
import { ProjectsWriter } from '../generators/modules/fileWriter.js';

const apiFetcher = new Fetcher();
const repos = apiFetcher.fetchGitRepos();
repos.then(res => res.json())
    .then(repos =>
    {
        if (!Array.isArray(repos))
        {
            throw new Error("GitHub API did not return an array. Response: " + JSON.stringify(repos, null, 2));
        }
        const projects = new RepoMapper().mapToProject(repos);
        new ProjectsWriter().writeToJsonFile(projects);
    })
    .catch(err =>
    {
        console.error("Fetch error:", err);
        process.exit(1);
    });
