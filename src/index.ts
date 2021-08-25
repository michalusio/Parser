import * as fs from 'fs';

import { check } from './checkers/checker';
import { program } from './language/program';
import { optimize } from './optimizers/optimizer';
import { ParseShowErrors } from './parser/parser';

const script = fs.readFileSync('./script.txt', 'utf8');

console.time('creating parser');
const parser = program()
console.timeEnd('creating parser');

console.time('parsing');
const res = ParseShowErrors(script, parser);
console.timeEnd('parsing');

if (res) {
  console.time('checking');
  const checked = check(res);
  console.timeEnd('checking');
  if (checked) {
    console.time('optimizing');
    const optimized = optimize(res);
    console.timeEnd('optimizing');

    console.log(JSON.stringify(optimized, null, 2));
  }
}