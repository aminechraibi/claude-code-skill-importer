import path from 'path';

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
