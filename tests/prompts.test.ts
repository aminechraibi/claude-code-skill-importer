import { describe, it, expect } from 'vitest';
import { validateSkillName } from '../src/prompts';

describe('validateSkillName', () => {
  it('accepts lowercase letters and hyphens', () => {
    expect(validateSkillName('my-skill')).toBe(true);
  });

  it('accepts uppercase letters', () => {
    expect(validateSkillName('MySkill')).toBe(true);
  });

  it('accepts underscores', () => {
    expect(validateSkillName('my_skill')).toBe(true);
  });

  it('accepts numbers', () => {
    expect(validateSkillName('skill123')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateSkillName('')).not.toBe(true);
  });

  it('rejects names with spaces', () => {
    expect(validateSkillName('my skill')).not.toBe(true);
  });

  it('rejects names with dots', () => {
    expect(validateSkillName('my.skill')).not.toBe(true);
  });

  it('rejects names with slashes', () => {
    expect(validateSkillName('my/skill')).not.toBe(true);
  });

  it('returns a string error message on failure', () => {
    const result = validateSkillName('bad name!');
    expect(typeof result).toBe('string');
    expect(result).toContain('letters, numbers, hyphens, and underscores');
  });
});
