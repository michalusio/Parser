import { readFileSync } from 'fs';

import { Context, EBNFParser, grammarToParser, ParseError } from '.';

const text = readFileSync('tests/ebnf/ebnf.ebnf', { encoding: 'utf-8' });
const ctx: Context = { text, index: 0, path: '' };

const parsedGrammar = EBNFParser(ctx);

if (parsedGrammar.success) {
  const startRule = parsedGrammar.value.find(r => r.identifier.name === 'grammar');
  if (startRule) {
    const createdParser = grammarToParser(parsedGrammar.value, startRule.identifier);
    
    const doubleParsed = createdParser(ctx);
    if (doubleParsed.success) {
      console.log('\ndouble parsed:');
      console.log(JSON.stringify(doubleParsed.value, null, 2));
    }
    else console.log(new ParseError('', ctx.text, doubleParsed.ctx.index, doubleParsed.history).getPrettyErrorMessage());
  }
}
else console.log(new ParseError('', ctx.text, parsedGrammar.ctx.index, parsedGrammar.history).getPrettyErrorMessage());