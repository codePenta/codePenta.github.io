/// <reference types="vite/client" />

const languageIcons = import.meta.glob<string>("../assets/icons/programming/*.svg",
    { eager: true, query: "?url", import: "default" });

const versionControlIcons = import.meta.glob<string>("../assets/icons/versionControl/*.svg",
    { eager: true, query: "?url", import: "default" });

const languagePath = (name: string) => `../assets/icons/programming/${name}.svg`;
const versionControlPath = (name: string) => `../assets/icons/versionControl/${name}.svg`;

// "C#" -> "csharp", "C++" -> "cpp"
const toSlug = (language: string) =>
    language.toLowerCase().replace(/#/g, "sharp").replace(/\+/g, "p");

export class IconService
{
    public getLanguageIconUrl(language: string): string
    {
        return languageIcons[languagePath(toSlug(language))]
            ?? languageIcons[languagePath("not specified")];
    }

    public getVersionControlIconUrl(url: string): string
    {
        const provider = new URL(url).hostname.split(".")[0];
        return versionControlIcons[versionControlPath(provider)]
            ?? versionControlIcons[versionControlPath("github")];
    }
}