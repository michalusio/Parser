import * as assert from 'assert';

import { fail, isFailure, ParseError, result } from '../src/types';

describe('isFailure', function() {
  it(`case 1: true`, () => {
    // Arrange
    const res = {
      success: false,
      expected: 'text',
      ctx: {
        text: 'text',
        path: '',
        index: 0
      },
      history: []
    };

    // Act
    const isIt = isFailure(res);

    // Assert
    assert.ok(isIt);
  });

  it(`case 2: true`, () => {
    // Arrange
    const res = {
      success: false,
      expected: 'some other text',
      ctx: {
        text: 'text',
        path: '',
        index: 15
      },
      history: []
    };

    // Act
    const isIt = isFailure(res);

    // Assert
    assert.ok(isIt);
  });

  it(`case 3: false`, () => {
    // Arrange
    const res = {
      success: true,
      expected: 'text',
      ctx: {
        text: 'text',
        path: '',
        index: 0
      },
      history: []
    };

    // Act
    const isIt = isFailure(res);

    // Assert
    assert.ok(!isIt);
  });

  it(`case 4: false`, () => {
    // Arrange
    const res = {
      success: true,
      expected: 'text',
      ctx: {
        text: 'text',
        path: '',
        index: 5
      },
      history: [ 'map' ]
    };

    // Act
    const isIt = isFailure(res);

    // Assert
    assert.ok(!isIt);
  });
});

describe('result', function() {
  it(`case 1`, () => {
    // Arrange
    const res = 5;
    const ctx = { text: 'text', path: '', index: 0 };

    // Act
    const suc = result(res)(ctx);

    // Assert
    assert.deepStrictEqual(suc, {
      success: true,
      value: 5,
      ctx: ctx
    });
  });

  it(`case 2`, () => {
    // Arrange
    const res = { data: 'someData' };
    const ctx = { text: 'text', path: '', index: 0 };

    // Act
    const suc = result(res)(ctx);

    // Assert
    assert.deepStrictEqual(suc, {
      success: true,
      value: { data: 'someData' },
      ctx: ctx
    });
  });
});

describe('fail', function() {
  it(`case`, () => {
    // Arrange
    const ctx = { text: 'text', path: '', index: 0 };

    // Act
    const suc = fail('some reason')(ctx);

    // Assert
    assert.deepStrictEqual(suc, {
      success: false,
      expected: 'some reason',
      ctx: ctx,
      history: [ 'some reason' ]
    });
  });
});

describe('ParseError', function() {
  it(`case 1`, () => {
    // Arrange
    const ctx = { text: 'text\nsecond text', path: '', index: 3 };

    // Act
    const error = new ParseError('some reason', ctx.text, ctx.index, []);

    // Assert
    assert.deepStrictEqual(error.getPrettyErrorMessage(), `some reason (line 1, col 4)\ntext\n   ^`);
  });

  it(`case 2`, () => {
    // Arrange
    const ctx = { text: 'text\nsecond text\nthird text!', path: '', index: 15 };

    // Act
    const error = new ParseError('some reason', ctx.text, ctx.index, []);

    // Assert
    assert.deepStrictEqual(error.getPrettyErrorMessage(), `some reason (line 2, col 11)\nsecond text\n          ^`);
  });

  it(`case 3`, () => {
    // Arrange
    const ctx = { text: 'text\nsecond text\nthird text!', path: '', index: 16 };

    // Act
    const error = new ParseError('some reason', ctx.text, ctx.index, []);

    // Assert
    assert.deepStrictEqual(error.getPrettyErrorMessage(), `some reason (line 3, col 0)\nthird text!\n^`);
  });
});