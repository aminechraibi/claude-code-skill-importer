import { describe, it, expect } from 'vitest';
import path from 'path';
import { detectInputType } from '../src/parser';

describe('detectInputType', () => {
  it('returns archive for .skill extension', () => {
    expect(detectInputType('/some/path/my-skill.skill')).toBe('archive');
  });

  it('returns archive for .zip extension', () => {
    expect(detectInputType('/some/path/my-skill.zip')).toBe('archive');
  });

  it('returns archive for uppercase extensions', () => {
    expect(detectInputType('/some/path/my-skill.SKILL')).toBe('archive');
    expect(detectInputType('/some/path/my-skill.ZIP')).toBe('archive');
  });

  it('returns skillmd for SKILL.md filename', () => {
    expect(detectInputType('/some/path/SKILL.md')).toBe('skillmd');
  });

  it('throws for unsupported extension', () => {
    expect(() => detectInputType('/some/path/skill.txt')).toThrow(
      'unsupported format. Use .skill, .zip, or SKILL.md'
    );
  });

  it('throws for a .md file that is not named SKILL.md', () => {
    expect(() => detectInputType('/some/path/README.md')).toThrow(
      'unsupported format. Use .skill, .zip, or SKILL.md'
    );
  });
});
