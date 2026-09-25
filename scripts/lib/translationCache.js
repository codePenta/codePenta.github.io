// lib/translationCache.js
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const CACHE_PATH = new URL("../.translation-cache.json", import.meta.url);

export function loadCache()
{
    if (!existsSync(CACHE_PATH)) return {};
    return JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
}

export function saveCache(cache)
{
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}