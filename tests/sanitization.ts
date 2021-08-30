const map: { [key: string]: { color?: string; text: string} } = {  // Special characters
  '\\': { text: '\\'},
  '\n': { color: '\x1b[33m', text: 'n'},
  '\r': { color: '\x1b[33m', text: 'r'},
  '\t': { color: '\x1b[33m', text: 't'}
};
export function sanitize(str: string | RegExp | null): string {
  if (typeof str === 'string') {
    return str.replace(/[\\\n\r\t]/g, i => `${map[i].color ?? ''}\\${map[i].text}\x1b[30;1m`);
  }
  else {
    return `\x1b[31;1m${str ? str : 'NULL'}\x1b[30;1m`;
  }
}