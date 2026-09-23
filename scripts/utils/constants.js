import dotenv from 'dotenv'
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// API constants
export const FETCH_TOKEN = process.env.REPOSITORY_FETCH_TOKEN || process.env.GITHUB_TOKEN || "";
export const GITHB_API_URL = "https://api.github.com/user/repos";

// File constants
export const RELATIVE_PATH_TO_DATA = "../../../public/data/";