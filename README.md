## Parser Combinators

[![CI](https://github.com/michalusio/Parser/actions/workflows/CI.yml/badge.svg?branch=master)](https://github.com/michalusio/Parser/actions/workflows/CI.yml)
[![npm version](https://badge.fury.io/js/parser-combinators.svg)](https://badge.fury.io/js/parser-combinators)
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A library of parser combinators, with which you can create your own parsers.

The library will be continuously improved in time.

As of now it contains the following combinators:
* Standard combinators:
    * `any`
    * `between`
    * `exhaust`
    * `many` (and `zeroOrMany`, `oneOrMany`, `oneOrManyRed`)
    * `map`
    * `opt`ional
    * `regex`
    * `seq`uence
    * `str`ing
* Utility combinators:
    * `ref`er
    * `expect`
* Ready-made value combinators:
    * `spaces`
    * `spacesPlus`
    * `wspaces`
    * `bool` (and `boolP`)
    * `int` (and `intP`)
    * `real` (and `realP`)
