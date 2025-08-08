export type GitHubRepoApiResponse = {
    name: string;
    description: string | null;
    url: string;
    image: string;
    language: string | null;
};

export type Project = {
    name: string;
    description: string;
    url: string;
    imageUrl: string;
    language: string;
};