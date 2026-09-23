export type Language = 'de' | 'en';

const LANGUAGE_STORAGE_KEY = 'portfolio-language';

export class TranslationService
{
    private language: Language = 'de';

    public initialize()
    {
        const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const browserLanguage = window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'de';
        const language = storedLanguage === 'de' || storedLanguage === 'en'
            ? storedLanguage
            : browserLanguage;

        this.setLanguage(language);
    }

    public toggle()
    {
        this.setLanguage(this.language === 'de' ? 'en' : 'de');
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

        document.querySelectorAll<HTMLElement>('[data-i18n-en]').forEach(element =>
        {
            if (!element.dataset.i18nDe)
            {
                element.dataset.i18nDe = element.textContent ?? '';
            }
            element.textContent = language === 'de' ? element.dataset.i18nDe! : element.dataset.i18nEn!;
        });

        document.querySelectorAll<HTMLElement>('section[data-nav-label-en]').forEach(section =>
        {
            if (!section.dataset.navLabelDe)
            {
                section.dataset.navLabelDe = section.dataset.navLabel ?? '';
            }
            section.dataset.navLabel = language === 'de' ? section.dataset.navLabelDe! : section.dataset.navLabelEn!;
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