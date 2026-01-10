import { afterEach } from "mocha";

export const mochaLog = (...data: unknown[]) => {
    logData.push(data.join(' '));
};

const logData: string[] = [];

afterEach(function() {
    let prefix = '';
    let parent = this.currentTest?.parent;
    while (parent) {
        prefix += '  ';
        parent = parent?.parent;
    }
    logData.forEach(line => console.log(prefix, '\x1b[0;33m', line, '\x1b[0m'));
    logData.length = 0;
});