import { updateState } from "../store";

export const clearElement = (element: Element) =>
{
    if (element)
    {
        element.innerHTML = '';
    }
};

export const renderError = (element: Element | null, error: any) =>
{
    console.log(`Error: ${error}`);

    if (element)
    {
        const errorElement = element;
        const isEnglish = document.documentElement.lang === "en";
        const errorMessage = isEnglish
            ? "The projects could not be loaded. Please try again later."
            : "Die Projekte konnten nicht geladen werden. Bitte versuche es später erneut.";
        errorElement.className = "error-message";
        errorElement.textContent = `${errorMessage} (${error})`;
    }
};

export const renderGlobalError = (element: Element | null, error: any) =>
{
    updateState([]);
    renderError(element, error);
};

export const removePrefixFromTag = (value: string) =>
{
    return value.substring(1, value.length);
};

export const getElementFromQuerySelector = (selector: string) =>
{
    const element = document.querySelector(selector)!;
    return element;
};

/**
 * Resolved, sobald die Seite aufgehört hat zu scrollen.
 *
 * Warum nicht einfach nur das 'scrollend'-Event?
 * - Ältere Safari-Versionen kennen es nicht.
 * - Wenn gar nicht gescrollt wird (Ziel ist schon im Bild), feuert es nie.
 * Deshalb zusätzlich: "seit idleMs kein 'scroll'-Event mehr" bzw. spätestens nach maxMs.
 */
export const waitForScrollEnd = (idleMs = 150, maxMs = 2000): Promise<void> =>
{
    return new Promise(resolve =>
    {
        let idleTimer = window.setTimeout(finish, idleMs);
        const maxTimer = window.setTimeout(finish, maxMs);

        function onScroll()
        {
            window.clearTimeout(idleTimer);
            idleTimer = window.setTimeout(finish, idleMs);
        }

        function finish()
        {
            window.clearTimeout(idleTimer);
            window.clearTimeout(maxTimer);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', finish);
            resolve();
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', finish);
    });
};
