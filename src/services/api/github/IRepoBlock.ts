export interface IRepoBlock
{
    id: string;
    name: string;
    owner: {
        login: string;
        avatar_url: string;
    };
    private: boolean;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    topics: string[];
    license: {
        key: string;
        name: string;
        url: string | null;
    } | null;
    description: string | null;
    html_url: string;
    created_at: string;
    updated_at: string;
}