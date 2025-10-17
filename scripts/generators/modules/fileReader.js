import { ICON_CATEGORIES, VALID_FILE_EXTENSION, RELATIVE_PATH_TO_ICONS } from '../../utils/constants.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export class IconsReader
{
    #fullIconsPath = "";

    #filename = null;
    #dirname = "";
    #category = "";

    constructor(category)
    {
        this.#filename = fileURLToPath(import.meta.url);
        this.#dirname = path.dirname(this.#filename);
        this.#category = category;
    }

    #readSVGFiles()
    {
        return fs.readdirSync(this.#fullIconsPath).filter((file) =>
        {
            var isValid = path.extname(file) === VALID_FILE_EXTENSION;
            return isValid;
        })
    }

    resolveIconsPathForCategory()
    {
        if (!ICON_CATEGORIES.includes(this.#category))
        {
            throw new Error(`Could not find icon category ${this.#category}`);
        }

        this.#fullIconsPath = path.resolve(this.#dirname, `${RELATIVE_PATH_TO_ICONS}${this.#category}`);
        console.log(this.#fullIconsPath);
    }


    getIconsFromFiles()
    {
        const svgFiles = this.#readSVGFiles();

        const iconMap = svgFiles.reduce((map, file) =>
        {
            let languageName = path.basename(file, VALID_FILE_EXTENSION).toLowerCase();
            const iconPath = `/assets/icons/${this.#category}/${file}`;
            console.log(iconPath);

            map[languageName] = iconPath;
            return map;
        }, {});

        return iconMap;
    }
}