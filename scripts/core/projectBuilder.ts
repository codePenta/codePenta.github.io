import Reader from '../api/ReposReader';
import Repo from '../entities/Repo';

export default class ProjectBuilder {

    reader: Reader;

    private shares: Partial<{ [key: string]: number }> = {};

    constructor(reader: Reader) {
        this.reader = reader
    }

    async getLanguages(): Promise<any> {
        const repos = await this.reader.getData();
        const languages = repos.map((repo: Repo) => repo.language);
        const uniqueLanguages = new Set(languages);

        uniqueLanguages.forEach((language: string) => {
            const count = languages.filter((l: string) => l === language).length;
            this.shares[language] = count;
        });

        return this.shares;
    }
}
