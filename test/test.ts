import { describe, it } from 'vitest';
import jscodeshift, { type API } from 'jscodeshift';
import transform from '../src/index.js';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const buildApi = (parser: string | undefined): API => ({
  j: parser ? jscodeshift.withParser(parser) : jscodeshift,
  jscodeshift: parser ? jscodeshift.withParser(parser) : jscodeshift,
  stats: () => {
    console.error(
      'The stats function was called, which is not supported on purpose',
    );
  },
  report: () => {
    console.error(
      'The report function was called, which is not supported on purpose',
    );
  },
});

const readFixtureFile = async (filename: string): Promise<string> => {
  return await readFile(join(__dirname, '..', '__testfixtures__', filename), 'utf-8');
}

const transformTsxInput = (input: string): string | undefined => {
  return transform({
      path: 'index.js',
      source: input,
    },
    buildApi('tsx'), {}
  );
}

const cleanOutput = (output?: string): string => {
  if (!output) return '';
  return output.replace(/W/gm, '');
}

describe('replace-default-export-with-named', () => {
  it('can replace end file default exports for const', async () => {
    const INPUT = await readFixtureFile('fixture1.input.tsx');
    const OUTPUT = await readFixtureFile('fixture1.output.tsx');

    const actualOutput = transformTsxInput(INPUT);

    assert.deepEqual(
      cleanOutput(actualOutput),
      cleanOutput(OUTPUT),
    );
  });

  it('can replace end file default exports for function', async () => {
    const INPUT = await readFixtureFile('fixture2.input.tsx');
    const OUTPUT = await readFixtureFile('fixture2.output.tsx');

    const actualOutput = transformTsxInput(INPUT);

    assert.deepEqual(
      cleanOutput(actualOutput),
      cleanOutput(OUTPUT),
    );
  });

  it('can replace inline default exports for function', async () => {
    const INPUT = await readFixtureFile('fixture3.input.tsx');
    const OUTPUT = await readFixtureFile('fixture3.output.tsx');

    const actualOutput = transformTsxInput(INPUT);

    assert.deepEqual(
      cleanOutput(actualOutput),
      cleanOutput(OUTPUT),
    );
  });
});