import { readFileSync } from 'node:fs';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import difference from '../src/index.js';
import { compare, stringifyObj } from '../src/difference.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const result = readFile('testResult.txt');
const obj1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};
const obj2 = { timeout: 20, verbose: true, host: 'hexlet.io' };

test('differenceSteps', () => {
  expect(compare(obj1, obj2)).toEqual({
    '- follow': false,
    host: 'hexlet.io',
    '- proxy': '123.234.53.22',
    timeout: [50, 20],
    '+ verbose': true,
  });
  expect(compare({}, {})).toEqual({});
});

test('diffStep', () => {
  const obj3 = compare(obj1, obj2);
  expect(stringifyObj(obj3)).toEqual(result);
  const obj4 = compare({}, {});
  expect(stringifyObj(obj4)).toEqual('{  \n}\n');
});

test('gendiff', () => {
  const filepath3 = getFixturePath('file1.json');
  const filepath4 = getFixturePath('file2.json');
  expect(difference(filepath3, filepath4)).toEqual(result);
});
