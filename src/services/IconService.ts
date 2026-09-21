import languageIcons from "../data/programmingIcons.json";
import versionControlIcons from "../data/versionControlIcons.json";

export class IconService
{
    private readonly languageIconMap: Record<string, string>;
    private readonly versionControlIconMap: Record<string, string>;

    constructor()
    {
        this.languageIconMap = languageIcons as Record<string, string>;
        this.versionControlIconMap = versionControlIcons as Record<string, string>;
    }

    public getLanguageIconUrl(language: string): string
    {
        const normalizedLanguage = language.toLowerCase();

        if (!this.languageIconMap[normalizedLanguage])
            throw new Error(`No icon found for language ${language}`);

        return this.languageIconMap[normalizedLanguage];
    }

    public getVersionControlIconUrl(url: string): string
    {
        const domainKey = this.getDomainFromVersionControl(url);

        if (!this.versionControlIconMap[domainKey])
            throw new Error(`No icon found for version control provider ${domainKey}`);

        return this.versionControlIconMap[domainKey];
    }

    public hasIconForLanguage(language: string): boolean
    {
        return Boolean(this.languageIconMap[language.toLowerCase()]);
    }

    private getDomainFromVersionControl(url: string): string
    {
        const hostname = new URL(url).host;
        const firstDotIndex = hostname.indexOf(".");

        return firstDotIndex === -1 ? hostname : hostname.substring(0, firstDotIndex);
    }
}