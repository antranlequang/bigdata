#!/usr/bin/env node

/**
 * Fix import paths for Vercel deployment
 * This script converts absolute imports to relative imports for better compatibility
 */

const fs = require('fs');
const path = require('path');

// Function to get relative path between two files
function getRelativePath(from, to) {
  const relative = path.relative(path.dirname(from), to);
  return relative.startsWith('.') ? relative : `./${relative}`;
}

// Function to recursively find files
function findFiles(dir, extensions = ['.ts', '.tsx'], exclude = ['node_modules', '.next', '.git']) {
  const files = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!exclude.some(ex => fullPath.includes(ex))) {
          scanDir(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return files;
}

console.log('🔧 Fixing import paths for Vercel deployment...');

// Find all TypeScript/React files
const allFiles = findFiles(process.cwd());
let totalFixed = 0;

allFiles.forEach(filePath => {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Skip files in node_modules, .next, etc.
  if (relativePath.includes('node_modules') || relativePath.includes('.next')) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const originalContent = content;
  
  // Fix @/lib imports
  content = content.replace(/from ['"`]@\/lib\/([^'"`]+)['"`]/g, (match, libPath) => {
    const targetPath = path.resolve(process.cwd(), 'lib', libPath);
    const relativePath = getRelativePath(filePath, targetPath);
    modified = true;
    console.log(`  📚 @/lib/${libPath} → ${relativePath}`);
    return `from '${relativePath}'`;
  });
  
  // Fix @/components imports
  content = content.replace(/from ['"`]@\/components\/([^'"`]+)['"`]/g, (match, componentPath) => {
    const targetPath = path.resolve(process.cwd(), 'components', componentPath);
    const relativePath = getRelativePath(filePath, targetPath);
    modified = true;
    console.log(`  🧩 @/components/${componentPath} → ${relativePath}`);
    return `from '${relativePath}'`;
  });
  
  // Fix other @/ imports
  content = content.replace(/from ['"`]@\/([^'"`]+)['"`]/g, (match, importPath) => {
    const targetPath = path.resolve(process.cwd(), importPath);
    const relativePath = getRelativePath(filePath, targetPath);
    modified = true;
    console.log(`  🔗 @/${importPath} → ${relativePath}`);
    return `from '${relativePath}'`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${relativePath}`);
    totalFixed++;
  }
});

console.log(`\n🎉 Import path fixes completed! Fixed ${totalFixed} files.`);