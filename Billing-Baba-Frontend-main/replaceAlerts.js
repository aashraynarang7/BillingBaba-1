const fs = require('fs');
const path = require('path');

const directory = "./app/dashboard";

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // We look for alert("Some text") or alert('Some text')
    // We assume mostly double quotes based on search results.
    const alertRegex = /alert\(["']([^"']+)["']\)/g;

    // First, let's see if there are any alerts at all.
    if (!alertRegex.test(content)) return;

    // Import toast if not present
    if (!content.includes("import { toast } from '@/components/ui/use-toast'") && !content.includes("import { toast } from \"@/components/ui/use-toast\"")) {
        // Find a good place to insert import. Usually after other standard imports.
        const importRegex = /^import .+?;?$/m;
        const lastImportMatches = [...content.matchAll(/^import .+?;?$/gm)];
        if (lastImportMatches.length > 0) {
            const lastImportIndex = lastImportMatches[lastImportMatches.length - 1].index;
            const insertIdx = content.indexOf('\n', lastImportIndex) + 1;
            content = content.slice(0, insertIdx) + "import { toast } from '@/components/ui/use-toast';\n" + content.slice(insertIdx);
        } else {
            content = "import { toast } from '@/components/ui/use-toast';\n" + content;
        }
        hasChanges = true;
    }

    // Now re-match and replace
    alertRegex.lastIndex = 0; // reset
    content = content.replace(alertRegex, (match, msg) => {
        hasChanges = true;
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('success') || lowerMsg.includes('created') || lowerMsg.includes('saved')) {
            // Success
            return `toast({ title: "${msg}", className: "bg-green-500 text-white" })`;
        } else if (lowerMsg.includes('fail') || lowerMsg.includes('error') || lowerMsg.includes('not')) {
            // Error/Warning
            return `toast({ title: "${msg}", variant: "destructive" })`;
        } else if (lowerMsg.includes('please') || lowerMsg.includes('empty')) {
            return `toast({ title: "${msg}", variant: "destructive" })`;
        } else {
            // Default notice
            return `toast({ title: "${msg}" })`;
        }
    });

    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

traverse(directory);
