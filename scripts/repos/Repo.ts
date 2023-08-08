export default class Repo {
    name: string;
    url: string;
    description: string;
    language: string;

    constructor(name: string, 
                url: string, 
                description: string, 
                language: string) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.language = language;
    }   
}