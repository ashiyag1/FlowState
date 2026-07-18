import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'controllers');
const routesDir = path.join(process.cwd(), 'routes');

const files = fs.readdirSync(controllersDir);

for (const file of files) {
  if (file.endsWith('.js') && !file.includes('Controller')) {
    const baseName = file.replace('.js', '');
    const newName = `${baseName}Controller.js`;
    
    // Rename controller
    fs.renameSync(
      path.join(controllersDir, file),
      path.join(controllersDir, newName)
    );
    
    // Update route file
    const routeFile = path.join(routesDir, file);
    if (fs.existsSync(routeFile)) {
      let content = fs.readFileSync(routeFile, 'utf8');
      content = content.replace(
        new RegExp(`'\\.\\./controllers/${baseName}\\.js'`),
        `'../controllers/${newName}'`
      );
      fs.writeFileSync(routeFile, content);
    }
  }
}
console.log('Renaming and updating complete.');
