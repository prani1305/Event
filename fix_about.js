const fs = require('fs');

let fileStr = fs.readFileSync('about.html', 'utf8');

const targetStr = `lights go down.\r\n            </p>`;
const targetStrAlt = `lights go down.\n            </p>`;

const newParagraph = `
            <p style="font-size: 1.15rem; line-height: 1.8; margin-bottom: 20px;">
                Today, JEW is more than an events agency—it is a robust <strong>group of companies and a business empire</strong>. Consisting of a diverse portfolio of successful ventures including <a href="https://bestmagicianvizag.com/" target="_blank" style="color:var(--crimson-depth); font-weight:bold; text-decoration:none;">Best Magician Vizag</a>, <a href="https://bestdjinvizag.com/" target="_blank" style="color:var(--crimson-depth); font-weight:bold; text-decoration:none;">Best DJ</a>, and <a href="https://jayanthiengineeringworks.com/" target="_blank" style="color:var(--crimson-depth); font-weight:bold; text-decoration:none;">Jayanthi Engineering Works</a>, the JEW umbrella delivers unparalleled excellence across both the entertainment and technical industries.
            </p>`;

if (fileStr.includes(targetStr)) {
    fileStr = fileStr.replace(targetStr, targetStr + newParagraph);
} else if (fileStr.includes(targetStrAlt)) {
    fileStr = fileStr.replace(targetStrAlt, targetStrAlt + newParagraph);
} else {
    // fallback
    fileStr = fileStr.replace(/lights go down.*<\/p>/m, match => match + newParagraph);
}

fs.writeFileSync('about.html', fileStr);
console.log('about.html updated.');
