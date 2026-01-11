import 'mocha';

import * as assert from 'assert';

import { str, stri } from '../src/parsers';
import { Context, isFailure } from '../src/types';
import { sanitize } from './sanitization';

describe('str', function() {

  const strings = [
    'test string',
    'asdfghjkl',
    'qwertyuiop',
    '\n\n\n\n',
    'Lazy fox\njumps over\na lazy dog',
    'a'
  ];

  describe('should return the requested value with the content\'s index at the end of text', () => {
    strings.forEach(testString => {
      it(`case: str('${sanitize(testString)}') -> '${sanitize(testString)}'`, () => {
        // Arrange
        const context: Context = { text: testString, index: 0, path: '' };
        const parser = str(testString);

        // Act
        const result = parser(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, testString);
        assert.deepStrictEqual(result.ctx, { text: testString, index: testString.length, path: '' });
      });
    });
  });

  describe('should return the requested value with the content\'s index at the middle of text', () => {
    strings.forEach(testString => {
      const partOfString = testString.slice(0, testString.length / 2);

      it(`case: str('${sanitize(testString)}') -> '${sanitize(partOfString)}'`, () => {
        // Arrange
        const context: Context = { text: testString, index: 0, path: '' };
        const parser = str(partOfString);

        // Act
        const result = parser(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, partOfString);
        assert.deepStrictEqual(result.ctx, { text: testString, index: partOfString.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    it('when the value is not equal', () => {
      // Arrange
      const context: Context = { text: 'test string', index: 0, path: '' };
      const parser = str('some other value');

      // Act
      const result = parser(context);

      // Assert
      assert.ok(isFailure(result));
    });
    it('when the value is not equal 2', () => {
      // Arrange
      const context: Context = { text: 'test string', index: 0, path: '' };
      const parser = str('x');

      // Act
      const result = parser(context);

      // Assert
      assert.ok(isFailure(result));
    });
    const strings = [
      'test string',
      'asdfghjkl',
      'qwertyuiop',
      'Lazy fox\njumps over\na lazy dog',
      'a'
    ];
    strings.forEach(testString => {
      it(`when the value is not equal by case (${sanitize(testString)})`, () => {
        // Arrange
        const context: Context = { text: testString.toUpperCase(), index: 0, path: '' };
        const parser = str(testString);

        // Act
        const result = parser(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
    it('when the value is right but the parser starts at the wrong index', () => {
      // Arrange
      const context: Context = { text: 'test string', index: 50, path: '' };
      const parser = str('test string');

      // Act
      const result = parser(context);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});

describe('stri', function() {

  const strings = [
    'test string',
    'asdfghjkl',
    'qwertyuiop',
    '\n\n\n\n',
    'Lazy fox\njumps over\na lazy dog',
    'a'
  ];

  describe('should return the requested value with the content\'s index at the end of text', () => {
    strings.forEach(testString => {
      it(`case: stri('${sanitize(testString)}') -> '${sanitize(testString)}'`, () => {
        // Arrange
        const context: Context = { text: testString, index: 0, path: '' };
        const parser = stri(testString);

        // Act
        const result = parser(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, testString.toLowerCase());
        assert.deepStrictEqual(result.ctx, { text: testString, index: testString.length, path: '' });
      });
      it(`case: stri('${sanitize(testString)}') -> '${sanitize(testString.toUpperCase())}'`, () => {
        // Arrange
        const context: Context = { text: testString.toUpperCase(), index: 0, path: '' };
        const parser = stri(testString);

        // Act
        const result = parser(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, testString.toLowerCase());
        assert.deepStrictEqual(result.ctx, { text: testString.toUpperCase(), index: testString.length, path: '' });
      });
    });
  });

  describe('should return the requested value with the content\'s index at the middle of text', () => {
    strings.forEach(testString => {
      const partOfString = testString.slice(0, testString.length / 2);

      it(`case: stri('${sanitize(testString)}') -> '${sanitize(partOfString)}'`, () => {
        // Arrange
        const context: Context = { text: testString, index: 0, path: '' };
        const parser = stri(partOfString);

        // Act
        const result = parser(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, partOfString.toLowerCase());
        assert.deepStrictEqual(result.ctx, { text: testString, index: partOfString.length, path: '' });
      });

      it(`case: stri('${sanitize(testString)}') -> '${sanitize(partOfString.toUpperCase())}'`, () => {
        // Arrange
        const context: Context = { text: testString, index: 0, path: '' };
        const parser = stri(partOfString);

        // Act
        const result = parser(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, partOfString.toLowerCase());
        assert.deepStrictEqual(result.ctx, { text: testString, index: partOfString.length, path: '' });
      });
    });
  });

  

  describe('should fail', () => {
    it('when the value is not equal', () => {
      // Arrange
      const context: Context = { text: 'test string', index: 0, path: '' };
      const parser = stri('some other value');

      // Act
      const result = parser(context);

      // Assert
      assert.ok(isFailure(result));
    });
    it('when the value is not equal 2', () => {
      // Arrange
      const context: Context = { text: 'test string', index: 0, path: '' };
      const parser = stri('x');

      // Act
      const result = parser(context);

      // Assert
      assert.ok(isFailure(result));
    });
    it('when the value is right but the parser starts at the wrong index', () => {
      // Arrange
      const context: Context = { text: 'test string', index: 50, path: '' };
      const parser = stri('test string');

      // Act
      const result = parser(context);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});