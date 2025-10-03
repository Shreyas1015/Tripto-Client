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

// Fix import paths in a file
const fixImportPaths = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix incorrect import paths for ImageOptimizer
    if (content.includes("from '../My_Components/ImageOptimizer'")) {
      content = content.replace(
        /from ['"]\.\.\/My_Components\/ImageOptimizer['"]/g, 
        "from '../../My_Components/ImageOptimizer'"
      );
      modified = true;
    }
    
    // Only write if changes were made
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed import paths in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Main function
const main = () => {
  console.log('Starting import path fix...');
  
  // Find all JS files
  let jsFiles = [];
  for (const dir of directories) {
    jsFiles = jsFiles.concat(findJsFiles(dir));
  }
  
  console.log(`Found ${jsFiles.length} JS files to process`);
  
  // Process each file
  for (const file of jsFiles) {
    fixImportPaths(file);
  }
  
  console.log('Import path fix complete!');
};

main();