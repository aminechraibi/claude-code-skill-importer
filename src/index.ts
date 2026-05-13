#!/usr/bin/env node
import path from 'path';
import { extractSkill } from './parser';
import { skillExists, installSkill, getSkillsDir } from './installer';
import { promptSkillName, promptConflict } from './prompts';

async function main(): Promise<void> {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: skill-import <file.skill|file.zip|SKILL.md|directory>');
    process.exit(1);
  }

  let skill;
  try {
    skill = extractSkill(path.resolve(filePath));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }

  let name = await promptSkillName(skill.defaultName);
  if (!name) process.exit(0);

  while (skillExists(name)) {
    const action = await promptConflict(name);
    if (action === 'cancel') {
      console.log('Cancelled.');
      process.exit(0);
    }
    const newName = await promptSkillName(null);
    if (!newName) process.exit(0);
    name = newName;
  }

  installSkill(name, skill.files);
  console.log(`✓ Skill "${name}" installed to ${getSkillsDir()}/${name}/`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  process.exit(1);
});
