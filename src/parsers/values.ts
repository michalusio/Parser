import { Parser } from '../types';
import { map } from './map';
import { opt } from './opt';
import { regex } from './regex';
import { seq } from './seq';
import { str } from './str';
import { expect } from './utilities';

/** Parses 0 or more spaces
 */
export const spaces: Parser<string> = regex(/ */, 'spaces');
/** Parses 1 or more spaces
 */
export const spacesPlus: Parser<string> = regex(/ +/, 'spaces');
/** Parses 0 or more whitespace characters
 */
export const wspaces: Parser<string | null> = opt(regex(/(?:\s|\t|\n|\r)+/, 'whitespace characters'));
/** Parses a boolean (true or false) and returns a string
 */
export const bool: Parser<'true'|'false'> = regex(/true|false/, 'boolean') as Parser<'true'|'false'>;
/** Parses a boolean (true or false) and returns a boolean
 */
export const boolP: Parser<boolean> = map(bool, val => val === 'true');
/** Parses an integer and returns a string
 */
export const int: Parser<string> = regex(/\d+/, 'integer');
/** Parses an integer and returns a number
 */
export const intP: Parser<number> = map(int, seq => parseInt(seq, 10));
/** Parses a standard real number (X.X) and returns a string
 */
export const real: Parser<`${number}.${number}`> = expect(map(seq(int, str('.'), int), ([intPart, , decimalPart]) => `${intPart}.${decimalPart}` as `${number}.${number}`), 'real');
/** Parses a standard real number (X.X) and returns a number
 */
export const realP: Parser<number> = map(real, (seq) => parseFloat(seq));