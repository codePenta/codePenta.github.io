import { updateState } from "../store";

export const clearElement = (element: Element) => 
{
    if (element)
    {
        element.innerHTML = '';
    }
}

export const renderError = (element: Element | null, error: any) => 
{
    console.log(`Error: ${error}`);

    if (element)
    {
        const errorElement = element;
        errorElement.textContent = "No projects available at the moment. Please check back later!";
        errorElement.className = "error-message";
        errorElement.innerHTML = `Failed loading data ${error}`;
    }
}

export const renderGlobalError = (element: Element | null, error: any) =>
{
    updateState([]);
    renderError(element, error);
}

export const removePrefixFromTag = (value: string) =>
{
    return value.substring(1, value.length);
}

export const getElementFromQuerySelector = (selector: string) => 
{
    const element = document.querySelector(selector)!;
    return element;
}