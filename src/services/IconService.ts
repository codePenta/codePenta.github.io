import icons from "../data/icons.json";

export class IconService
{
    private readonly iconMap: { [key: string]: string; } | undefined;

    private availableLanguages: any[] = [];

    constructor()
    {
        this.iconMap = icons;
    }

    public getIconUrl(language: string)
    {
        if (this.iconMap === undefined)
            throw new Error(`No icon found for language ${language}`);

        return this.iconMap[language.toLowerCase()];
    }

    public hasIconForLanguage(language: string): boolean
    {
        const languageSet = new Set(this.availableLanguages);
        return languageSet.has(language.toLowerCase);
    }
}