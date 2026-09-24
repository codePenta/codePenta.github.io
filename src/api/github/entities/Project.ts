// Project.ts
export type Locale = "de" | "en";

export type I18nMap = Record<string, { de: string; en: string }>;

export type GitHubRepoApiResponse = {
    name: string;
    description: string | null;
    url: string;
    image: string;
    language: string | null;
    tags: string[];
    languageIconUrl: string | null;
    versionControl: string | null;
};

export type Project = {
    name: string;
    description: string;
    url: string;
    imageUrl: string;
    language: string;
    tags: string[];
    languageIconUrl: string | null;
    versionControl: string | null;
};