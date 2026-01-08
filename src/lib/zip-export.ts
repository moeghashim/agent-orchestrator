import JSZip from 'jszip';
import prdJsonExample from '../../prd.json.example?raw';
import prdSkillMd from '../../skills/prd/SKILL.md?raw';
import ralphSkillMd from '../../skills/ralph/SKILL.md?raw';

interface BundleFiles {
  ralphSh: string;
  promptMd: string;
  prdJson: string;
}

/**
 * Creates a ZIP file containing the Ralph bundle with proper folder structure
 * - scripts/ralph/ralph.sh
 * - scripts/ralph/prompt.md
 * - scripts/ralph/prd.json
 * - prd.json.example
 * - skills/prd/SKILL.md
 * - skills/ralph/SKILL.md
 * - tasks/ (empty folder for future tasks)
 */
export async function createBundleZip(
  files: BundleFiles,
  projectName: string
): Promise<Blob> {
  const zip = new JSZip();

  // Create scripts/ralph/ folder structure
  const ralphFolder = zip.folder('scripts/ralph');
  if (ralphFolder) {
    ralphFolder.file('ralph.sh', files.ralphSh);
    ralphFolder.file('prompt.md', files.promptMd);
    ralphFolder.file('prd.json', files.prdJson);
  }

  // Create tasks/ folder (empty, for future task files)
  zip.folder('tasks');

  zip.file('prd.json.example', prdJsonExample);

  const prdSkillsFolder = zip.folder('skills/prd');
  if (prdSkillsFolder) {
    prdSkillsFolder.file('SKILL.md', prdSkillMd);
  }

  const ralphSkillsFolder = zip.folder('skills/ralph');
  if (ralphSkillsFolder) {
    ralphSkillsFolder.file('SKILL.md', ralphSkillMd);
  }

  // Create a basic progress.txt
  const progressContent = `# Ralph Progress Log
Project: ${projectName}
Started: ${new Date().toISOString()}
---

Ready for Ralph execution. Run \`./scripts/ralph/ralph.sh\` to begin.
`;
  zip.file('progress.txt', progressContent);

  // Generate the ZIP blob
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates and downloads a Ralph bundle ZIP
 */
export async function downloadBundleZip(
  files: BundleFiles,
  projectName: string
): Promise<void> {
  const safeName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const blob = await createBundleZip(files, projectName);
  downloadBlob(blob, `ralph-bundle-${safeName}.zip`);
}
