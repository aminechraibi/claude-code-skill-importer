import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

export type InputType = 'archive' | 'skillmd';

export interface SkillFile {
  relativePath: string;
  content: Buffer;
}

export interface ParsedSkill {
  type: InputType;
  defaultName: string | null;
  files: SkillFile[];
}

export function detectInputType(filePath: string): InputType {
  const base = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (base === 'SKILL.md') return 'skillmd';
  if (ext === '.skill' || ext === '.zip') return 'archive';

  throw new Error('unsupported format. Use .skill, .zip, or SKILL.md');
}

export function extractSkill(filePath: string): ParsedSkill {
  if (!fs.existsSync(filePath)) {
    throw new Error(`file not found: ${filePath}`);
  }

  const type = detectInputType(filePath);

  if (type === 'skillmd') {
    const content = fs.readFileSync(filePath);
    return {
      type: 'skillmd',
      defaultName: null,
      files: [{ relativePath: 'SKILL.md', content }],
    };
  }

  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();

  const skillMdEntries = entries
    .filter(e => !e.isDirectory && path.posix.basename(e.entryName) === 'SKILL.md')
    .sort((a, b) => a.entryName.split('/').length - b.entryName.split('/').length);

  if (skillMdEntries.length === 0) {
    throw new Error('no SKILL.md found inside the archive');
  }

  const skillMd = skillMdEntries[0];
  const skillRoot = path.posix.dirname(skillMd.entryName);
  const prefix = skillRoot === '.' ? '' : skillRoot + '/';

  const files: SkillFile[] = entries
    .filter(e => !e.isDirectory && e.entryName.startsWith(prefix))
    .map(e => ({
      relativePath: e.entryName.slice(prefix.length),
      content: e.getData(),
    }));

  const defaultName = path.basename(filePath, path.extname(filePath));

  return { type: 'archive', defaultName, files };
}
