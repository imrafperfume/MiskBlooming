import fs from 'fs';
import path from 'path';

const schemaDir = 'prisma/schema';
const outputFile = 'prisma/schema.prisma';

const files = fs.readdirSync(schemaDir).filter(f => f.endsWith('.prisma'));

let datasource = '';
let generator = '';
let models = '';

files.forEach(file => {
    const content = fs.readFileSync(path.join(schemaDir, file), 'utf8');

    // Extract datasource
    const dsMatch = content.match(/datasource\s+\w+\s+\{[\s\S]*?\}/);
    if (dsMatch && !datasource) {
        datasource = dsMatch[0];
    }

    // Extract generator
    const genMatch = content.match(/generator\s+\w+\s+\{[\s\S]*?\}/);
    if (genMatch && !generator) {
        // We want to make sure prismaSchemaFolder preview feature is removed if we move to single file
        generator = genMatch[0].replace(/previewFeatures\s*=\s*\["prismaSchemaFolder"\]/, '');
    }

    // Clean content - remove datasource and generator
    let cleaned = content
        .replace(/datasource\s+\w+\s+\{[\s\S]*?\}/g, '')
        .replace(/generator\s+\w+\s+\{[\s\S]*?\}/g, '');

    models += `// Source: ${file}\n${cleaned}\n\n`;
});

const finalSchema = `${datasource}\n\n${generator}\n\n${models}`;

fs.writeFileSync(outputFile, finalSchema);
console.log(`Merged schema written to ${outputFile}`);
