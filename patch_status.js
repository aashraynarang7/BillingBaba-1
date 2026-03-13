const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            filelist = walkSync(dirFile, filelist);
        } else {
            if (dirFile.endsWith('page.tsx') || dirFile.endsWith('Page.tsx')) {
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

    // Find all matches of isPaid: <expression>\n that do not have `status: ` right after
    content = content.replace(/(isPaid:\s*[^,\n]+)(?=[\n\r]+\s*\}\);)/g, '$1,\n                status: p.status || doc?.status || order?.status || inv?.status');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated status mapping in: ${path.basename(file)}`);
    }
});
