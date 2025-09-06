import dotenv from 'dotenv'
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// API constants
export const FETCH_TOKEN = process.env.REPOSITORY_FETCH_TOKEN;
export const GITHB_API_URL = "https://api.github.com/user/repos";

// File constants
const PATH_TO_PUBLIC_DIRECTORY = "../../../public/"
export const RELATIVE_PATH_TO_DATA = `${PATH_TO_PUBLIC_DIRECTORY}data/`;
export const RELATIVE_PATH_TO_ICONS = `${PATH_TO_PUBLIC_DIRECTORY}assets/icons/`;
export const RELATIVE_OUTPUT_PATH = "../src/data"
export const VALID_FILE_EXTENSION = ".svg";

export const ICON_CATEGORIES = [
    'programming',
    'versionControl'
]