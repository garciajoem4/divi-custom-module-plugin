#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Enhanced CSS minification function
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around certain characters
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim()
        // Remove empty rules
        .replace(/[^{}]+\{\s*\}/g, '')
        // Simplify zero values
        .replace(/\b0[a-z%]+/gi, '0')
        // Simplify color values
        .replace(/#([a-f\d])\1([a-f\d])\2([a-f\d])\3/gi, '#$1$2$3')
        // Remove redundant semicolons
        .replace(/;+/g, ';')
        // Remove last semicolon in rule
        .replace(/;}/g, '}');
}

// Function to read and process CSS files
function combineAndMinifyCSS() {
    const cssFiles = [
        'includes/fields/Input/style.css',
        'includes/modules/AweberSignup/style.css',
        'includes/modules/AweberFormEmbed/style.css',
        'includes/modules/PdfViewer/style.css',
        'includes/modules/PopupModule/style.css'
    ];

    let combinedCSS = '';
    let headerComment = '/* Divi Custom Modules - Combined & Minified Styles */\n';
    let sourceMap = '';
    
    console.log('🎨 Starting CSS minification process...');
    
    cssFiles.forEach((filePath, index) => {
        if (fs.existsSync(filePath)) {
            console.log(`📁 Processing: ${filePath}`);
            
            const css = fs.readFileSync(filePath, 'utf8');
            const moduleName = path.basename(path.dirname(filePath));
            
            // Add module header comment (only in development)
            if (process.env.NODE_ENV !== 'production') {
                combinedCSS += `\n/* ${moduleName} Module Styles */\n`;
            }
            combinedCSS += css + '\n';
        } else {
            console.warn(`⚠️  Warning: File not found: ${filePath}`);
        }
    });

    // Minify the combined CSS
    console.log('⚡ Minifying combined CSS...');
    const minifiedCSS = headerComment + minifyCSS(combinedCSS);

    // Ensure styles directory exists
    const stylesDir = 'styles';
    if (!fs.existsSync(stylesDir)) {
        fs.mkdirSync(stylesDir, { recursive: true });
        console.log('📂 Created styles directory');
    }

    // Write minified CSS to file
    const outputPath = path.join(stylesDir, 'style.min.css');
    fs.writeFileSync(outputPath, minifiedCSS, 'utf8');
    
    // Also create an unminified version for development
    const devOutputPath = path.join(stylesDir, 'style.css');
    fs.writeFileSync(devOutputPath, headerComment + combinedCSS, 'utf8');
    
    // Calculate file sizes
    const originalSize = combinedCSS.length;
    const minifiedSize = minifiedCSS.length;
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ CSS minification complete!`);
    console.log(`📁 Minified output: ${outputPath}`);
    console.log(`📁 Development output: ${devOutputPath}`);
    console.log(`📊 Original size: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`📊 Minified size: ${(minifiedSize / 1024).toFixed(1)} KB`);
    console.log(`💾 Space saved: ${savings}%`);
    console.log(`🎯 Total modules processed: ${cssFiles.length}`);
    
    return outputPath;
}

// Run the function
try {
    combineAndMinifyCSS();
} catch (error) {
    console.error('❌ Error during CSS minification:', error.message);
    process.exit(1);
}
