## Parser Combinators

[![Node.js CI](https://github.com/michalusio/Parser/actions/workflows/CI.yml/badge.svg?branch=master)](https://github.com/michalusio/Parser/actions/workflows/CI.yml)
[![CodeQL](https://github.com/michalusio/Parser/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/michalusio/Parser/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/michalusio/Parser/branch/master/graph/badge.svg?token=GWIWKBDVD4)](https://codecov.io/gh/michalusio/Parser)


[![NPM Version](https://badge.fury.io/js/parser-combinators.svg)](https://badge.fury.io/js/parser-combinators)
[![No Dependencies](https://status.david-dm.org/gh/michalusio/parser.svg)](https://status.david-dm.org/)

A library of parser combinators, with which you can create your own parsers.

#### Parser combinators can be used for:

- Replacing complicated regular expressions with easy-to-understand parsers
- Incorporating custom languages into your application
- Introducing higher-order functions and parsing concepts

#### This package:

- Has full TypeScript support and is made with `strict` mode on
- Is thoroughly tested
- Is made in the _Simplicity first_ philosophy
- Will be continuously improved in time

##### As of now it contains the following combinators:

- Standard combinators:
  - `any`
  - `between`
  - `exhaust`
  - `many` (and `zeroOrMany`, `oneOrMany`, `oneOrManyRed`)
  - `map`
  - `opt`ional
  - `regex`
  - `seq`uence
  - `str`ing
- Utility combinators:
  - `ref`er
  - `expect`
- Ready-made value combinators:
  - `spaces`
  - `spacesPlus`
  - `wspaces`
  - `bool` (and `boolP`)
  - `int` (and `intP`)
  - `real` (and `realP`)

### Example usage:

##### Using standard combinators:

    import { seq, str, any } from 'parser-combinators/parsers';
    import { ParseText } from 'parser-combinators';

    const parser = seq(str('a'), any(str('b'), str('c')));
    const result = ParseText('ab', parser); // Will return ['a', 'b']

##### Using ready value combinators:

    import { wspaces, str, realP, map } from 'parser-combinators/parsers';
    import { ParseText } from 'parser-combinators';

    const parser = map(
        seq(wspaces, str('number:'), wspaces, realP, wspaces),
        ([,,, data]) => data
    );
    const result = ParseText(' number: 1.75  ', parser); // Will return 1.75

##### Using `ref` to expand the parser's possibilities:

    import { wspaces, str, realP, map } from 'parser-combinators/parsers';
    import { ParseText } from 'parser-combinators';

    const parser = ref(
        map(
            seq(wspaces, str('number:'), wspaces, realP, wspaces),
            ([,,, data]) => data
        ),
        data => data > 1.5,
        'The number must be over 1.5!'
    );
    const result = ParseText(' number: 1.25  ', parser); // Will throw a ParseError('The number must be over 1.5!')
