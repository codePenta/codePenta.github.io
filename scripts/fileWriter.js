import { ICON_CATEGORIES, RELATIVE_OUTPUT_PATH } from './utils/constants.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export class IconsWriter
{
    #fileName = null;
    #outputFile = "";

    #category = "";

    constructor(category)
    {
        this.#fileName = fileURLToPath(import.meta.url);
        this.#category = category;
    }

    buildOutputPathForCategory()
    {
        var dirname = path.dirname(this.#fileName);
        var outputDir = path.resolve(dirname, RELATIVE_OUTPUT_PATH);
        fs.mkdirSync(outputDir, { recursive: true });

        if (!ICON_CATEGORIES.includes(this.#category))
        {
            throw new Error(`Could not find icon category ${this.#category}`);
        }

        var iconFileName = `${this.#category}Icons.json`;
        this.#outputFile = path.join(outputDir, iconFileName);
    }

    writeIconsFromSVG(iconMap)
    {
        if (this.#outputFile === "")
        {
            throw new Error("No output file specified");
        }

        fs.writeFileSync(this.#outputFile, JSON.stringify(iconMap, null, 2), 'utf-8');
    }
}