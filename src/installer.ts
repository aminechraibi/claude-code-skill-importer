import fs from 'fs';
import path from 'path';
import os from 'os';
import { SkillFile } from './parser';

export function getSkillsDir(): string {
  return path.join(os.homedir(), '.claude', 'skills');
}

export function skillExists(name: string, baseDir?: string): boolean {
  return fs.existsSync(path.join(baseDir ?? getSkillsDir(), name));
}

export function installSkill(name: string, files: SkillFile[], baseDir?: string): void {
  const skillDir = path.join(baseDir ?? getSkillsDir(), name);
  fs.mkdirSync(skillDir, { recursive: true });

  for (const file of files) {
    const dest = path.join(skillDir, file.relativePath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, file.content);
  }
}
