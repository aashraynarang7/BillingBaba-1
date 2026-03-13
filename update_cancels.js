const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            filelist = walkSync(dirFile, filelist);
        } else {
            if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
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
    let originalContent = content;

    // Replace deletePurchase with cancelPurchase in handle actions
    if (content.includes('deletePurchase(')) {
        content = content.replace(/deletePurchase/g, 'cancelPurchase');
        content = content.replace(/toast\(\{ title: "Failed to delete"/g, 'toast({ title: "Failed to cancel"');
    }

    // Replace deleteSale with cancelSale in handle actions
    if (content.includes('deleteSale(')) {
        content = content.replace(/deleteSale/g, 'cancelSale');
        content = content.replace(/toast\(\{ title: "Failed to delete"/g, 'toast({ title: "Failed to cancel"');
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log('Modified APIs in:', file);
    }
});
