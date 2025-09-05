import languageIcons from "../data/programmingIcons.json";
import versionControlIcons from "../data/versionControlIcons.json";

export class IconService
{
    private readonly languageIconMap: { [key: string]: string; } | undefined;
    private readonly versionControlIcanMap: { [key: string]: string; } | undefined;

    private availableLanguages: any[] = [];

    constructor()
    {
        this.languageIconMap = languageIcons;
        this.versionControlIcanMap = versionControlIcons;
    }

    public getLanguageIconUrl(language: string)
    {
        if (this.languageIconMap === undefined)
            throw new Error(`No icon found for language ${language}`);

        return this.languageIconMap[language.toLowerCase()];
    }

    public getVersionControlIconUrl(url: string)
    {
        if (this.versionControlIcanMap === undefined)
            throw new Error(`No icon found for language ${url}`);

        return this.versionControlIcanMap[this.getDomainFromVersionControl(url)];
    }

    public hasIconForLanguage(language: string): boolean
    {
        const languageSet = new Set(this.availableLanguages);
        return languageSet.has(language.toLowerCase);
    }

    private getDomainFromVersionControl(url: string): string
    {
        let hostname: string = new URL(url).host;
        let withoutTopLevelDomain = hostname.substring(0, hostname.indexOf("."));
        return withoutTopLevelDomain;
    }
}