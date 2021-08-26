import * as fs from 'fs';

import { isFailure, ParseError, Parser } from './types';

/** Parses the utf-8 content of a given file's content.
 * @param path The path to the file to parse.
 * @param parser The parser to use.
 * @returns The result of the parse.
 * @throws {ParseError} if the parsing fails or the parser does not consume the full input.
 */
export function ParseFile<T>(path: string, parser: Parser<T>): T {
    const text = fs.readFileSync(path, 'utf8');
    return ParseText(text, parser, path);
}

/** Parses the given string.
 * @param text The string to parse.
 * @param parser The parser to use.
 * @param path The path of the parsed text. Can be used for error reporting.
 * @returns The result of the parse.
 * @throws {ParseError} if the parsing fails or the parser does not consume the full input.
 */
export function ParseText<T>(text: string, parser: Parser<T>, path = ''): T {
    const res = parser({text, path, index: 0});
    if (isFailure(res)) {
        throw new ParseError(`Parse error, expected ${[...res.history].pop()} at char ${res.ctx.index}`, text, res.ctx.index, res.history);
    }
    if (res.ctx.index !== text.length) {
        throw new ParseError(`Parse error at index ${res.ctx.index}`, text, res.ctx.index, []);
    }
    return res.value;
}
