const fs = require('fs');
const path = require('path');

// Directories to search for components with errors
const directories = [
  path.join(__dirname, '../src/My_Components'),
  path.join(__dirname, '../src/Pages')
];

// Find all JS and JSX files
const findJsFiles = (dir) => {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findJsFiles(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(filePath);
    }
  }
  
  return results;
};

// Fix all errors in a file
const fixAllErrors = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix broken LazyImage tags
    if (content.includes('LazyImage') && content.includes('/ effect="blur"')) {
      content = content.replace(/(<LazyImage[^>]*)\/ effect="blur" \/>/g, '$1 effect="blur" />');
      modified = true;
    }
    
    // Fix broken import statements
    if (content.includes('import {') && content.includes('import LazyImage from')) {
      content = content.replace(/import \{\s*import LazyImage from ['"]([^'"]+)['"];\s*([^}]+)\}/gs, 
        (match, path, rest) => {
          return `import LazyImage from '${path}';\nimport {\n  ${rest}}`;
        });
      modified = true;
    }
    
    // Fix duplicate LazyImage imports
    const importRegex = /import\s+LazyImage\s+from\s+['"][^'"]+['"]/g;
    const imports = content.match(importRegex) || [];
    
    if (imports.length > 1) {
      // Keep only the first LazyImage import
      for (let i = 1; i < imports.length; i++) {
        content = content.replace(imports[i], `// ${imports[i]} // Removed duplicate`);
      }
      modified = true;
    }
    
    // Only write if changes were made
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed errors in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Main function
const main = () => {
  console.log('Starting error fix...');
  
  // Find all JS files
  let jsFiles = [];
  for (const dir of directories) {
    jsFiles = jsFiles.concat(findJsFiles(dir));
  }
  
  console.log(`Found ${jsFiles.length} JS files to process`);
  
  // Process each file
  for (const file of jsFiles) {
    fixAllErrors(file);
  }
  
  console.log('Error fix complete!');
};

main();