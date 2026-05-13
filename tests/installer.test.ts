import { describe, it, expect, afterEach } from 'vitest';
import { skillExists, installSkill } from '../src/installer';
import os from 'os';
import path from 'path';
import fs from 'fs';

const tmpBase = path.join(os.tmpdir(), 'skill-import-test-' + Date.now());

afterEach(() => {
  fs.rmSync(tmpBase, { recursive: true, force: true });
});

describe('skillExists', () => {
  it('returns false when skill directory does not exist', () => {
    expect(skillExists('nonexistent-skill', tmpBase)).toBe(false);
  });

  it('returns true when skill directory exists', () => {
    fs.mkdirSync(path.join(tmpBase, 'my-skill'), { recursive: true });
    expect(skillExists('my-skill', tmpBase)).toBe(true);
  });
});

describe('installSkill', () => {
  it('creates skill directory and writes files', () => {
    const files = [
      { relativePath: 'SKILL.md', content: Buffer.from('# My Skill') },
      { relativePath: 'helper.md', content: Buffer.from('helper content') },
    ];

    installSkill('my-skill', files, tmpBase);

    expect(fs.existsSync(path.join(tmpBase, 'my-skill', 'SKILL.md'))).toBe(true);
    expect(fs.readFileSync(path.join(tmpBase, 'my-skill', 'SKILL.md'), 'utf8')).toBe('# My Skill');
    expect(fs.existsSync(path.join(tmpBase, 'my-skill', 'helper.md'))).toBe(true);
  });

  it('creates nested directories for files with subdirectory paths', () => {
    const files = [
      { relativePath: 'SKILL.md', content: Buffer.from('# Skill') },
      { relativePath: 'sub/nested.md', content: Buffer.from('nested') },
    ];

    installSkill('my-skill', files, tmpBase);

    expect(fs.existsSync(path.join(tmpBase, 'my-skill', 'sub', 'nested.md'))).toBe(true);
  });

  it('creates base directory if it does not exist', () => {
    const newBase = path.join(os.tmpdir(), 'skill-import-newbase-' + Date.now());

    installSkill('my-skill', [{ relativePath: 'SKILL.md', content: Buffer.from('x') }], newBase);

    expect(fs.existsSync(path.join(newBase, 'my-skill', 'SKILL.md'))).toBe(true);

    fs.rmSync(newBase, { recursive: true, force: true });
  });
});
