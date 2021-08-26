## Parser Combinators

A library of parser combinators, with which you can create your own parsers.

The library will be continuously improved in time.

As of now it contains the following combinators:
* Standard combinators:
    * `any`
    * `between`
    * `exhaust`
    * `many`
    * `map`
    * `opt`
    * `regex`
    * `seq`
    * `str`
* Utility combinators:
    * `ref`
    * `expect`
* Ready-made value combinators:
    * `spaces`
    * `spacesPlus`
    * `wspaces`
    * `bool` (and `boolP`)
    * `int` (and `intP`)
    * `real` (and `realP`)