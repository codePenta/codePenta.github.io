import { isJSDocPrivateTag, isPrivateIdentifier } from "typescript";

export type GitHubRepoApiResponse = {
    name: string;
    description: string | null;
    html_url: string;
    owner: {
        avatar_url: string;
    };
    topics?: string[];
    language: string | null;
};

export type Project = {
    id: string;
    name: string;
    description: string;
    url: string;
    imageUrl: string;
    tags: string[];
    language: string;
};