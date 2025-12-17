# VS Code Setup for Simcoe Stone Project

## ✅ Current Configuration

Your VS Code is configured with **project-specific instructions** for Simcoe Stone Masonry:

### Active Instructions
- **File**: `SimcoeStone.instructions.md` (in VS Code prompts folder)
- **Scope**: Only applies to Simcoe Stone project folders
- **Content**: React, TypeScript, Tailwind, Netlify best practices

### Workspace Settings
**Location**: `.vscode/settings.json`
```json
{
  "github.copilot.prompt.instructions": {
    "enabled": true,
    "include": ["SimcoeStone.instructions.md"],
    "exclude": ["VantaFigma.instructions.md"]
  }
}
```

## 🎯 What This Gives You

When working on Simcoe Stone project, the AI assistant knows:
- ✅ **Tech Stack**: React, TypeScript, Tailwind CSS, Framer Motion
- ✅ **Deployment**: Netlify with Netlify Forms
- ✅ **Business Context**: Masonry services, target audience
- ✅ **Code Standards**: Component structure, animation guidelines
- ✅ **Best Practices**: Performance, accessibility, responsive design

## 🔧 Managing Instructions

### To Edit Instructions
```bash
code "%APPDATA%\Code\User\prompts\SimcoeStone.instructions.md"
```

### To Disable Instructions
Rename the file to `.disabled`:
```bash
Rename-Item "SimcoeStone.instructions.md" "SimcoeStone.instructions.md.disabled"
```

### For New Projects
Copy the `.vscode/settings.json` to exclude old instructions:
```json
{
  "github.copilot.prompt.instructions": {
    "enabled": true,
    "exclude": ["VantaFigma.instructions.md", "OtherProject.instructions.md"]
  }
}
```

---

**Your VS Code is optimized for Simcoe Stone development!**
