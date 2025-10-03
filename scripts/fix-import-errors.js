const fs = require('fs');
const path = require('path');

// Directories to search for components with import errors
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

// Fix duplicate import statements
const fixImportErrors = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has import statements
    if (!content.includes('import ')) {
      return;
    }
    
    console.log(`Processing ${filePath}`);
    
    // Get all import statements
    const importRegex = /import\s+.*\s+from\s+['"].*['"]/g;
    const imports = content.match(importRegex) || [];
    
    // Check for duplicate LazyImage imports
    const lazyImageImports = imports.filter(imp => imp.includes('LazyImage'));
    
    if (lazyImageImports.length > 1) {
      // Keep only the first LazyImage import
      const firstImport = lazyImageImports[0];
      
      // Remove other LazyImage imports
      for (let i = 1; i < lazyImageImports.length; i++) {
        content = content.replace(lazyImageImports[i], '// ' + lazyImageImports[i] + ' // Removed duplicate');
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed duplicate imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Main function
const main = () => {
  console.log('Starting import error fix...');
  
  // Find all JS files
  let jsFiles = [];
  for (const dir of directories) {
    jsFiles = jsFiles.concat(findJsFiles(dir));
  }
  
  console.log(`Found ${jsFiles.length} JS files to process`);
  
  // Process each file
  for (const file of jsFiles) {
    fixImportErrors(file);
  }
  
  console.log('Import error fix complete!');
};

main();