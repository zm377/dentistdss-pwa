import { describe, test, expect } from 'vitest';

// Type definitions for test objects
interface TestUser {
  name: string;
  age: number;
}

describe('JavaScript Fundamentals', () => {
  test('basic math operations', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
    expect(3 * 4).toBe(12);
    expect(8 / 2).toBe(4);
  });

  test('string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
    expect('WORLD'.toLowerCase()).toBe('world');
    expect('hello world'.includes('world')).toBe(true);
  });

  test('array operations', () => {
    const arr: number[] = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
    expect(arr.filter((x: number) => x > 3)).toEqual([4, 5]);
    expect(arr.map((x: number) => x * 2)).toEqual([2, 4, 6, 8, 10]);
  });

  test('object operations', () => {
    const obj: TestUser = { name: 'Test', age: 25 };
    expect(obj.name).toBe('Test');
    expect(Object.keys(obj)).toEqual(['name', 'age']);
    expect(Object.values(obj)).toEqual(['Test', 25]);
  });
});
