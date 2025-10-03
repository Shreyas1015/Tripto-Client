const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to search for image tags
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

// Replace img tags with LazyImage component
const replaceImgTags = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that already import LazyImage
    if (content.includes('import LazyImage from')) {
      console.log(`Skipping ${filePath} - already uses LazyImage`);
      return;
    }
    
    // Check if file contains img tags
    if (!content.includes('<img')) {
      return;
    }
    
    console.log(`Processing ${filePath}`);
    
    // Add import statement
    const importStatement = "import LazyImage from '../My_Components/ImageOptimizer';\n";
    
    // Find the right place to add the import
    const importIndex = content.lastIndexOf('import ');
    if (importIndex !== -1) {
      const importEndIndex = content.indexOf('\n', importIndex) + 1;
      content = content.slice(0, importEndIndex) + importStatement + content.slice(importEndIndex);
    } else {
      content = importStatement + content;
    }
    
    // Replace img tags with LazyImage
    content = content.replace(/<img([^>]*)>/g, (match, attributes) => {
      // Don't replace img tags in comments
      if (match.trim().startsWith('//')) {
        return match;
      }
      
      // Check if the tag is self-closing
      if (attributes.trim().endsWith('/')) {
        return `<LazyImage${attributes} effect="blur" />`;
      } else {
        return `<LazyImage${attributes} effect="blur"></LazyImage>`;
      }
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
};

// Main function
const main = () => {
  console.log('Starting image optimization...');
  
  // Find all JS files
  let jsFiles = [];
  for (const dir of directories) {
    jsFiles = jsFiles.concat(findJsFiles(dir));
  }
  
  console.log(`Found ${jsFiles.length} JS files to process`);
  
  // Process each file
  for (const file of jsFiles) {
    replaceImgTags(file);
  }
  
  console.log('Image optimization complete!');
};

main();