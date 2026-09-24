const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

/**
 * Translates a single text string via the DeepL free-tier API.
 *
 * @param {string} text       - Source text (English from GitHub)
 * @param {string} targetLang - DeepL language code, e.g. "DE"
 * @param {string} apiKey     - DEEPL_API_KEY secret
 * @returns {Promise<string>} - Translated text
 */
export async function translate(text, targetLang, apiKey)
{
    if (!text) return "";

    const response = await fetch(DEEPL_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `DeepL-Auth-Key ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: [text],
            source_lang: "EN",
            target_lang: targetLang,
        }),
    });

    if (!response.ok)
        throw new Error(`DeepL API responded with ${response.status}`);

    const data = await response.json();
    return data.translations[0].text;
}