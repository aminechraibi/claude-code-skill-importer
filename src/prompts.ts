import prompts from 'prompts';

export function validateSkillName(name: string): true | string {
  if (/^[a-zA-Z0-9_-]+$/.test(name)) return true;
  return 'Skill name must only contain letters, numbers, hyphens, and underscores';
}

export async function promptSkillName(defaultName: string | null): Promise<string | null> {
  const response = await prompts(
    {
      type: 'text',
      name: 'name',
      message: 'Skill name:',
      initial: defaultName ?? '',
      validate: validateSkillName,
    },
    { onCancel: () => process.exit(0) }
  );

  return response.name ?? null;
}

export async function promptConflict(name: string): Promise<'rename' | 'cancel'> {
  const response = await prompts(
    {
      type: 'select',
      name: 'action',
      message: `Skill "${name}" is already installed. What do you want to do?`,
      choices: [
        { title: 'Change name', value: 'rename' },
        { title: 'Cancel', value: 'cancel' },
      ],
    },
    { onCancel: () => process.exit(0) }
  );

  return (response.action as 'rename' | 'cancel') ?? 'cancel';
}
