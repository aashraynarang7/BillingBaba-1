const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            filelist = walkSync(dirFile, filelist);
        } else {
            if (dirFile.match(/Create.*Page\.tsx/)) {
                filelist.push(dirFile);
            }
        }
    });
    return filelist;
};

const frontendDir = 'c:\\CMT AI projects\\BillingBaba\\Billing-Baba-Frontend-main\\app\\dashboard';
const files = walkSync(frontendDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Skip if already processed
    if (content.includes('const isCancelled = initialData?.status === \'Cancelled\';')) return;

    // Insert isCancelled hook right after export default function CreateXYZPage(...) {
    content = content.replace(/(export default function \w+\([^)]+\)\s*\{)/, "$1\n    const isCancelled = initialData?.status === 'Cancelled';\n");

    // Locate the Actions div. We know it often has "{/* Actions */}" or "<Button onClick={handleSave}"
    // By modifying exactly the Save button to be hidden if cancelled.
    content = content.replace(/(<Button[^>]*onClick=\{handleSave\}[^>]*>)/g, '{!isCancelled && $1');
    // Since we prepended {!isCancelled && to the opening tag, we need to append } to the closing tag.
    content = content.replace(/\{!isCancelled && (<Button[^>]*onClick=\{handleSave\}[^>]*>[\s\S]*?<\/Button>)/g, '{!isCancelled && $1}');

    // In Create pages where they use a "fixed inset-0" modal wrapper (like DebitNote), 
    // or "bg-slate-50 min-h-screen" wrapper, we can inject a class to block all pointer events *except* footer.
    content = content.replace(/(<div className="[^"]*bg-white[^"]*shadow[^"]*")/g, "$1 style={{ pointerEvents: isCancelled ? 'none' : 'auto', opacity: isCancelled ? 0.85 : 1 }}");

    // Re-enable pointer events on the footer actions so Cancel/Print still works
    content = content.replace(/(<div className="[^"]*border-t pt-4[^"]*")/g, "$1 style={{ pointerEvents: 'auto' }}");
    content = content.replace(/(<div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg")/g, "$1 style={{ pointerEvents: 'auto' }}");
    content = content.replace(/(<div className="flex items-center justify-between border-t border-gray-100 p-4 bg-gray-50 rounded-b-lg")/g, "$1 style={{ pointerEvents: 'auto' }}");

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Processed: ${path.basename(file)}`);
    }
});

console.log("Done adding cancelled view-only restrictions.");
