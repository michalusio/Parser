import 'mocha';

import * as assert from 'assert';

import { bool, boolP, eof, int, intP, real, realP, spaces, spacesPlus, wspaces } from '../src/parsers';
import { Context, isFailure } from '../src/types';
import { sanitize } from './sanitization';

describe('spaces', function() {
  describe('should parse', () => {
    const cases = [
      { t: '     ', e: '     '},
      { t: '', e: ''},
      { t: '  ', e: '  '},
      { t: 'a     ', e: ''},
      { t: 'bas', e: ''},
      { t: '\n\n', e: ''}
    ];
    cases.forEach(({t, e}) => {
      it(`case: '${sanitize(t)}' -> '${sanitize(e)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = spaces(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, e);
        assert.deepStrictEqual(result.ctx, { text: t, index: e.length, path: '' });
      });
    });
  });
});

describe('spacesPlus', function() {
  describe('should parse', () => {
    const cases = [
      '     ',
      ' ',
      '  '
    ];
    cases.forEach(c => {
      it(`case: '${sanitize(c)}'`, () => {
        // Arrange
        const context: Context = { text: c, index: 0, path: '' };

        // Act
        const result = spacesPlus(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, c);
        assert.deepStrictEqual(result.ctx, { text: c, index: c.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'a     ',
      '',
      'bas',
      '\n\n'
    ];
    cases.forEach(c => {
      it(`case: '${sanitize(c)}'`, () => {
        // Arrange
        const context: Context = { text: c, index: 0, path: '' };

        // Act
        const result = spacesPlus(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});

describe('wspaces', function() {
  describe('should parse', () => {
    const cases = [
      { t: '     ', e: '     ' },
      { t: ' ', e: ' ' },
      { t: '  ', e: '  ' },
      { t: '\n\n', e: '\n\n' },
      { t: '\t \n', e: '\t \n' },
      { t: 'a     ', e: null },
      { t: '', e: null },
      { t: 'bas', e: null }
    ];
    cases.forEach(({t, e}) => {
      it(`case: '${sanitize(t)}' -> '${sanitize(e)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = wspaces(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, e);
        assert.deepStrictEqual(result.ctx, { text: t, index: e ? e.length : 0, path: '' });
      });
    });
  });
});

describe('bool', function() {
  describe('should parse', () => {
    const cases = [
      'true',
      'false',
      'true'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = bool(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, t);
        assert.deepStrictEqual(result.ctx, { text: t, index: t.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'f231',
      'fh316',
      '-0879i46742167'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = bool(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});

describe('boolP', function() {
  describe('should parse', () => {
    const cases = [
      'true',
      'false',
      'true'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = boolP(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, t === 'true');
        assert.deepStrictEqual(result.ctx, { text: t, index: t.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'f231',
      'fh316',
      '-0879i46742167'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = boolP(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});

describe('int', function() {
  describe('should parse', () => {
    const cases = [
      '1',
      '16',
      '46742167'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = int(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, t);
        assert.deepStrictEqual(result.ctx, { text: t, index: t.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'f231',
      'fh316',
      '-0879i46742167'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = int(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});

describe('intP', function() {
  describe('should parse', () => {
    const cases = [
      '1',
      '16',
      '46742167'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = intP(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, parseInt(t, 10));
        assert.deepStrictEqual(result.ctx, { text: t, index: t.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'f231',
      'fh316',
      '-0879i46742167'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = intP(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});

describe('real', function() {
  describe('should parse', () => {
    const cases = [
      '1.1',
      '16.0876',
      '46742167.567'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = real(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, t);
        assert.deepStrictEqual(result.ctx, { text: t, index: t.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'f231',
      'fh316',
      '-0879i46742167',
      '12',
      '031561'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = real(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});

describe('realP', function() {
  describe('should parse', () => {
    const cases = [
      '1.1',
      '16.0876',
      '46742167.567'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = realP(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, parseFloat(t));
        assert.deepStrictEqual(result.ctx, { text: t, index: t.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'f231',
      'fh316',
      '-0879i46742167',
      '12',
      '031561'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = realP(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});

describe('eof', function() {
  describe('should parse', () => {
    const cases = [
      ''
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = eof(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.deepStrictEqual(result.ctx, { text: t, index: t.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const cases = [
      'f231',
      'fh316',
      '-0879i46742167',
      '12',
      '031561'
    ];
    cases.forEach(t => {
      it(`case: '${sanitize(t)}'`, () => {
        // Arrange
        const context: Context = { text: t, index: 0, path: '' };

        // Act
        const result = eof(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});