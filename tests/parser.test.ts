import { describe, it, expect } from 'vitest';
import path from 'path';
import AdmZip from 'adm-zip';
import os from 'os';
import fs from 'fs';
import { detectInputType, extractSkill } from '../src/parser';

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

describe('extractSkill - archive', () => {
  function makeTempZip(entries: { name: string; content: string }[], filename = 'test.skill'): string {
    const zip = new AdmZip();
    for (const e of entries) zip.addFile(e.name, Buffer.from(e.content));
    const tmpPath = path.join(os.tmpdir(), filename);
    zip.writeZip(tmpPath);
    return tmpPath;
  }

  it('extracts skill files from zip with folder prefix', () => {
    const tmp = makeTempZip([
      { name: 'my-skill/SKILL.md', content: '# My Skill' },
      { name: 'my-skill/extra.md', content: 'extra' },
    ]);

    const result = extractSkill(tmp);

    expect(result.defaultName).toBe('test');
    expect(result.type).toBe('archive');
    expect(result.files.find(f => f.relativePath === 'SKILL.md')?.content.toString()).toBe('# My Skill');
    expect(result.files.find(f => f.relativePath === 'extra.md')?.content.toString()).toBe('extra');

    fs.unlinkSync(tmp);
  });

  it('extracts skill files when SKILL.md is at zip root', () => {
    const tmp = makeTempZip([
      { name: 'SKILL.md', content: '# Root Skill' },
      { name: 'helper.md', content: 'helper' },
    ]);

    const result = extractSkill(tmp);

    expect(result.files.find(f => f.relativePath === 'SKILL.md')).toBeTruthy();
    expect(result.files.find(f => f.relativePath === 'helper.md')).toBeTruthy();

    fs.unlinkSync(tmp);
  });

  it('uses shallowest SKILL.md when multiple exist', () => {
    const tmp = makeTempZip([
      { name: 'skill/SKILL.md', content: '# Shallow' },
      { name: 'skill/sub/SKILL.md', content: '# Deep' },
    ]);

    const result = extractSkill(tmp);

    expect(result.files.find(f => f.relativePath === 'SKILL.md')?.content.toString()).toBe('# Shallow');

    fs.unlinkSync(tmp);
  });

  it('throws when no SKILL.md in archive', () => {
    const tmp = makeTempZip([{ name: 'other.md', content: 'not a skill' }]);

    expect(() => extractSkill(tmp)).toThrow('no SKILL.md found inside the archive');

    fs.unlinkSync(tmp);
  });

  it('throws when file does not exist', () => {
    expect(() => extractSkill('/tmp/nonexistent-abc123.skill')).toThrow('file not found');
  });

  it('uses zip filename (without extension) as defaultName', () => {
    const tmp = makeTempZip(
      [{ name: 'cool-skill/SKILL.md', content: '# Cool' }],
      'cool-skill.zip'
    );

    const result = extractSkill(tmp);
    expect(result.defaultName).toBe('cool-skill');

    fs.unlinkSync(tmp);
  });
});
