export type GitHubRepoApiResponse = {
    name: string;
    description: string | null;
    url: string;
    image: string;
    language: string | null;
    languageIconUrl: string | null;
};

export type Project = {
    name: string;
    description: string;
    url: string;
    imageUrl: string;
    language: string;
    languageIconUrl: string | null;
};