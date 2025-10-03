const fs = require('fs');
const path = require('path');

// Directories to search for components with LazyImage syntax errors
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

// Fix LazyImage syntax errors
const fixLazyImageSyntax = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that don't use LazyImage
    if (!content.includes('<LazyImage')) {
      return;
    }
    
    console.log(`Processing ${filePath}`);
    
    // Fix the broken LazyImage syntax
    const fixedContent = content.replace(/(<LazyImage[^>]*)\/ effect="blur" \/>/g, '$1 effect="blur" />');
    
    // Only write if changes were made
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed LazyImage syntax in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Main function
const main = () => {
  console.log('Starting LazyImage syntax fix...');
  
  // Find all JS files
  let jsFiles = [];
  for (const dir of directories) {
    jsFiles = jsFiles.concat(findJsFiles(dir));
  }
  
  console.log(`Found ${jsFiles.length} JS files to process`);
  
  // Process each file
  for (const file of jsFiles) {
    fixLazyImageSyntax(file);
  }
  
  console.log('LazyImage syntax fix complete!');
};

main();