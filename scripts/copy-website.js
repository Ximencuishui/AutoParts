/* Copies website/ -> dist/ for Vercel (Linux build environment). */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'website');
const dest = path.join(root, 'dist');

function cpRecursive(from, to) {
    const st = fs.statSync(from);
    if (st.isDirectory()) {
        fs.mkdirSync(to, { recursive: true });
        for (const name of fs.readdirSync(from)) {
            cpRecursive(path.join(from, name), path.join(to, name));
        }
    } else {
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
    }
}

if (!fs.existsSync(src)) {
    console.error('Missing website/ directory');
    process.exit(1);
}
if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true });
}
cpRecursive(src, dest);
console.log('Copied website/ -> dist/');
