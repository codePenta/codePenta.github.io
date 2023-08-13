export default class Repo {
    name: string;
    url: string;
    description: string;
    languageUsed: string;

    constructor(name: string, 
                url: string, 
                description: string, 
                languageUsed: string) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.languageUsed = languageUsed;
    }   
}