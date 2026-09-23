export function mapProject(repo)
{
    return {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        url: repo.html_url,
        image: repo.owner.avatar_url,
        tags: repo.topics ?? []
    };
}