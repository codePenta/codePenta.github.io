export type Language = 'de' | 'en';

const LANGUAGE_STORAGE_KEY = 'portfolio-language';

export class TranslationService
{
    private language: Language = 'de';

    public initialize(): Language
    {
        const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const browserLanguage = window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'de';
        const language = storedLanguage === 'de' || storedLanguage === 'en'
            ? storedLanguage
            : browserLanguage;

        this.setLanguage(language);
        return this.language;
    }

    public toggle(): Language
    {
        this.setLanguage(this.language === 'de' ? 'en' : 'de');
        return this.language;
    }

    public getLanguage(): Language
    {
        return this.language;
    }

    private setLanguage(language: Language): void
    {
        this.language = language;
        document.documentElement.lang = language;
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

        document.querySelectorAll<HTMLElement>('[data-i18n-de][data-i18n-en]').forEach(element =>
        {
            element.textContent = element.dataset[`i18n${language === 'de' ? 'De' : 'En'}`] ?? '';
        });

        document.querySelectorAll<HTMLElement>('section[data-nav-label-de][data-nav-label-en]').forEach(section =>
        {
            section.dataset.navLabel = section.dataset[language === 'de' ? 'navLabelDe' : 'navLabelEn'];
        });

        const toggle = document.querySelector<HTMLButtonElement>('#language-toggle');
        if (toggle)
        {
            toggle.textContent = language === 'de' ? 'EN' : 'DE';
            toggle.setAttribute('aria-label', language === 'de'
                ? 'Seite auf Englisch anzeigen'
                : 'Show page in German');
        }
    }
}
