import { check } from './checkers/checker';
import { program } from './language/program';
import { optimize } from './optimizers/optimizer';
import { ParseShowErrors } from './parser/parser';

console.time('parsing');
const res = ParseShowErrors('./script.mlang', program());
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