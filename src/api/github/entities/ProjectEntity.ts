import { StringOrBuffer } from "bun";
import { isJSDocPrivateTag, isPrivateIdentifier } from "typescript";

export class RepoEntity
{
    id: string;
    name: string;
    owner: {
        login: string;
        avatar_url: string;
    };
    is_private: boolean;
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

    constructor(
        id: string,
        name: string,
        owner: {
            login: string,
            avatar_url: string
        },
        is_private: boolean,
        language: string | null,
        stargazers_count: number,
        forks_count: number,
        open_issues_count: number,
        topics: string[],
        license: {
            key: string;
            name: string;
            url: string | null;
        } | null,
        description: string | null,
        html_url: string,
        created_at: string,
        updated_at: string)
    {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.is_private = is_private;
        this.language = language;
        this.stargazers_count = stargazers_count;
        this.forks_count = forks_count;
        this.open_issues_count = open_issues_count;
        this.topics = topics;
        this.license = license;
        this.description = description;
        this.html_url = html_url;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}