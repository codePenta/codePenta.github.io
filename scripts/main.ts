import "../styles/style.css";

import Builder from "./core/pageBuilder";

export default class Main {

  constructor() {
    new Builder().build();
  }
}

const main = new Main();
