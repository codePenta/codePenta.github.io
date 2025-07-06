import { RepoEntity } from '../../../api/entities/RepoEntity';
import { fetchRepos } from '../../../api/github/githubAPI';

export async function getGitHubRepositories(): Promise<any>
{
    return await fetchRepos();
}