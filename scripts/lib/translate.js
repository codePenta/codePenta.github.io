// lib/translate.js
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

async function callDeepL(text, targetLang, apiKey)
{
    const response = await fetch(DEEPL_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `DeepL-Auth-Key ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: [text],
            target_lang: targetLang,
            // Kein source_lang -> DeepL erkennt die Ausgangssprache selbst
        }),
    });

    if (!response.ok)
        throw new Error(`DeepL API responded with ${response.status}`);

    const data = await response.json();

    return {
        text: data.translations[0].text,
        detectedSourceLang: data.translations[0].detected_source_language, // z.B. "EN", "DE"
    };
}

/**
 * Übersetzt eine Beschreibung automatisch in beide Richtungen (DE <-> EN).
 * Erkennt die Ausgangssprache selbst, statt sie fest anzunehmen.
 *
 * War die Beschreibung schon Deutsch -> Original bleibt "de",
 * nur die englische Version wird zusätzlich geholt (1 API-Call).
 * War sie Englisch -> umgekehrt (ebenfalls 1 API-Call).
 * Für alles andere (z.B. wenn du mal Französisch schreibst) wird
 * die Originalsprache als "en" behandelt — DeepL kennt nur DE/EN als Ziel hier.
 *
 * @param {string} text   - Rohe Beschreibung von GitHub
 * @param {string} apiKey - DEEPL_API_TOKEN secret
 * @returns {Promise<{en: string, de: string}>}
 */
export async function translateBoth(text, apiKey)
{
    if (!text) return { en: "", de: "" };

    const first = await callDeepL(text, "EN", apiKey);

    if (first.detectedSourceLang === "DE")
    {
        return { de: text, en: first.text };
    }

    if (first.detectedSourceLang === "EN")
    {
        const second = await callDeepL(text, "DE", apiKey);
        return { en: text, de: second.text };
    }

    // Weder DE noch EN erkannt (z.B. FR) -> Original nirgendwo unübersetzt
    // einsetzen, sondern beide Zielsprachen sauber von DeepL übersetzen lassen.
    console.warn(`Unerwartete Sprache "${first.detectedSourceLang}" erkannt für: "${text}"`);
    const second = await callDeepL(text, "DE", apiKey);
    return { en: first.text, de: second.text };
}