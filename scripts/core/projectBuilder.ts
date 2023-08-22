import Reader from '../api/ReposReader';
import Repo from '../entities/Repo';

export default class ProjectBuilder {

    reader: Reader;

    private shares: Partial<{ [key: string]: { amount: number, linkToNext: string } }> = {};

    constructor(reader: Reader) {
        this.reader = reader
    }

    async getLanguages(): Promise<any> {
        const repos = await this.reader.getData();
        const allLanguages = repos.map((repo: Repo) => repo.language);
        const uniqueLanguages = new Set(allLanguages);

        uniqueLanguages.forEach((language: string) => {
            this.shares[language] = {
                amount: allLanguages.filter((l: string) => l === language).length,
                linkToNext: repos.find((repo: Repo) => repo.language === language)["language"]
            }
        });

        console.log(this.shares)

        return this.shares;
    }
}

export class ProjectsPageBuilder {

}