import Reader from '../api/ReposReader';

export default class ProjectBuilder {

    reader: Reader;

    constructor(reader: Reader) {
        this.reader = reader
    }

    createSummaryContents() {
        this.reader.getResults().filter(repo => repo.languageUsed === 'C++').forEach(repo => {

        });
    }
}