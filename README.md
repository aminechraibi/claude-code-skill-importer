# skill-import

> Import Claude Code skills from `.skill`, `.zip`, `SKILL.md`, or a folder — no installation required.

[![npm](https://img.shields.io/npm/v/skill-import)](https://www.npmjs.com/package/skill-import)

---

## Requirements

You need **Node.js** installed on your system. Claude Code already requires Node.js, so if you're using Claude Code you're all set.

- **Check if Node is installed:** `node --version` (should print `v18` or higher)
- **Install Node.js:** Download from [nodejs.org](https://nodejs.org) — choose the LTS version
- **npx** comes bundled with Node.js (npm v5.2+), no separate install needed

---

## Usage

No installation required — just run with `npx`:

```bash
npx skill-import my-skill.skill
npx skill-import my-skill.zip
npx skill-import SKILL.md
npx skill-import ./my-skill-folder/
```

The tool will:
1. Detect the input type automatically
2. Prompt you to confirm (or change) the skill name
3. Check for conflicts — prompts to rename or cancel if the skill already exists
4. Copy the skill to `~/.claude/skills/<name>/`

Claude Code auto-discovers skills in `~/.claude/skills/`, so no further setup is needed after import.

---

## Supported Input Formats

| Format | Description | Default name |
|--------|-------------|--------------|
| `.skill` | A zip archive containing a `SKILL.md` | Filename without extension |
| `.zip` | Same as `.skill`, different extension | Filename without extension |
| `SKILL.md` | A bare skill file | You will be prompted |
| Directory | A folder containing a `SKILL.md` | Folder name |

---

## Skill Name Rules

Skill names may only contain **letters, numbers, hyphens (`-`), and underscores (`_`)**.

Examples of valid names: `my-skill`, `MySkill`, `skill_v2`

---

## Creating a `.skill` File

A `.skill` file is just a `.zip` archive with a `SKILL.md` inside. You can create one with any zip tool.

**Structure:**
```
my-skill/
  SKILL.md          ← required
  helpers/
    prompt.md       ← optional supporting files
```

**Create with zip (Linux/Mac):**
```bash
zip -r my-skill.skill my-skill/
```

**Create with PowerShell (Windows):**
```powershell
Compress-Archive -Path my-skill\* -DestinationPath my-skill.skill
```

**Create with 7-Zip (Windows):**
Right-click the folder → 7-Zip → Add to archive → rename to `.skill`

---

## What is a SKILL.md?

A `SKILL.md` is a Markdown file that defines a Claude Code skill — a set of instructions that Claude follows when invoked via `/skill-name`. Skills live in `~/.claude/skills/<name>/SKILL.md` and are auto-discovered by Claude Code.

---

## For GitHub Users

### Sharing a skill from your repo

If your repository contains a skill folder, users can install it directly:

```bash
# Clone and import
git clone https://github.com/you/your-skill-repo
npx skill-import ./your-skill-repo/

# Or just download the SKILL.md
curl -O https://raw.githubusercontent.com/you/your-skill-repo/main/SKILL.md
npx skill-import SKILL.md
```

### Publishing a `.skill` file with a GitHub Release

1. Create your skill folder with a `SKILL.md`
2. Zip it: `zip -r my-skill.skill my-skill/`
3. Create a GitHub Release and attach `my-skill.skill` as an asset
4. Users can then download and run: `npx skill-import my-skill.skill`

### Adding a badge to your README

```markdown
[![Install with skill-import](https://img.shields.io/badge/install-skill--import-blue)](https://www.npmjs.com/package/skill-import)
```

---

## Contributing

```bash
git clone https://github.com/YOUR_USERNAME/claude-code-skill-importer
cd claude-code-skill-importer
npm install
npm test        # run tests
npm run build   # compile TypeScript
```

PRs welcome. Please add tests for any new behaviour.

---

## License

MIT
