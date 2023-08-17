import Reader from '../api/ReposReader';

export default class ProjectBuilder {

    reader: Reader;

    private shares: Partial<{ [key: string]: number }> = {};

    constructor(reader: Reader) {
        this.reader = reader
    }

    createSummaryContents() {
        
    }

    addShare(language: string, stars: number) {
        if (this.shares[language]) {
            this.shares[language] += stars;
        } else {
            this.shares[language] = stars;
        }
    }

    removeShare(language: string) {
        delete this.shares[language];
    }
}
