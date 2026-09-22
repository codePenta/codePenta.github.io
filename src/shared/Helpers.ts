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
