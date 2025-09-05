export class RepoMapper
{
    mapToProject(reposToMap)
    {
        const mappedProjects = reposToMap.map(repo => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            url: repo.html_url,
            image: repo.owner.avatar_url,
            tags: repo.topics || []
        }))

        return mappedProjects;
    }
}