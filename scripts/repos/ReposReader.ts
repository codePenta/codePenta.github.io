import { Octokit } from "octokit";

export default class ReposReader {

    constructor() {}

    async getData() {
        try {
            
            const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });

            const reposListRaw = await octokit.rest.repos.listForAuthenticatedUser();

            console.log(reposListRaw);
            

        } catch (error: any) {
            console.error(error)
        }
    }
}