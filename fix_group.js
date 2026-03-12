const fs = require('fs');

const groupSection = `<div>
                    <h4 class="mono" style="color:var(--warm-sand);">JEW Group</h4>
                    <ul>
                        <li><a href="https://bestmagicianvizag.com/" target="_blank" style="color: inherit; text-decoration: none;">Best Magician Vizag</a></li>
                        <li><a href="https://bestdjinvizag.com/" target="_blank" style="color: inherit; text-decoration: none;">Best DJ</a></li>
                        <li><a href="https://jayanthiengineeringworks.com/" target="_blank" style="color: inherit; text-decoration: none;">Jayanthi Engineering Works</a></li>
                    </ul>
                </div>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Find the end of the Quick Links div
    // We can use a regex that matches the entire "Quick Links" div block, 
    // and append our new group section right after it.

    // Quick Links typically ends with </ul>\s*</div>
    const regex = /<h4 class="mono">Quick Links<\/h4>[\s\S]*?<\/ul>\s*<\/div>/;

    // Check if it's already there to prevent duplicates
    if (!content.includes('>JEW Group</h4>')) {
        content = content.replace(regex, match => match + "\n                " + groupSection);
        fs.writeFileSync(file, content);
    }
});
console.log('Added JEW Group to footers.');
