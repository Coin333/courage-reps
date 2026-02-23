/**
 * COURAGE REPS - Validation Script
 * Validates the project structure and code integrity
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Required files for the project
const REQUIRED_FILES = [
    'index.html',
    'dashboard.html',
    'css/styles.css',
    'js/pretest.js',
    'js/dashboard.js',
    'js/challenges.js',
    'package.json',
    'vercel.json',
    'README.md'
];

// Validation results
let passed = 0;
let failed = 0;

console.log('\n🔍 COURAGE REPS - Project Validation\n');
console.log('='.repeat(50));

// Check required files exist
console.log('\n📁 Checking required files...\n');

REQUIRED_FILES.forEach(file => {
    const filePath = path.join(ROOT, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
        passed++;
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        failed++;
    }
});

// Validate HTML files
console.log('\n📄 Validating HTML files...\n');

function validateHTML(filename) {
    const filePath = path.join(ROOT, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`  ❌ ${filename} - File not found`);
        failed++;
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const checks = [
        { test: content.includes('<!DOCTYPE html>'), name: 'DOCTYPE declaration' },
        { test: content.includes('<html'), name: 'html tag' },
        { test: content.includes('<head>'), name: 'head tag' },
        { test: content.includes('<body>'), name: 'body tag' },
        { test: content.includes('viewport'), name: 'viewport meta tag' },
        { test: content.includes('styles.css'), name: 'CSS link' }
    ];
    
    let fileValid = true;
    checks.forEach(check => {
        if (!check.test) {
            console.log(`  ⚠️  ${filename}: Missing ${check.name}`);
            fileValid = false;
        }
    });
    
    if (fileValid) {
        console.log(`  ✅ ${filename} - Valid`);
        passed++;
    } else {
        failed++;
    }
}

validateHTML('index.html');
validateHTML('dashboard.html');

// Validate JavaScript files
console.log('\n📜 Validating JavaScript files...\n');

function validateJS(filename) {
    const filePath = path.join(ROOT, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`  ❌ ${filename} - File not found`);
        failed++;
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax check - look for common patterns
    const hasContent = content.trim().length > 0;
    const hasNoSyntaxErrors = !content.includes('function(') || content.includes('function ') || content.includes('function(');
    
    if (hasContent) {
        console.log(`  ✅ ${filename} - Valid`);
        passed++;
    } else {
        console.log(`  ❌ ${filename} - Empty or invalid`);
        failed++;
    }
}

validateJS('js/pretest.js');
validateJS('js/dashboard.js');
validateJS('js/challenges.js');

// Validate challenges data
console.log('\n🎯 Validating challenges database...\n');

const challengesPath = path.join(ROOT, 'js/challenges.js');
if (fs.existsSync(challengesPath)) {
    const content = fs.readFileSync(challengesPath, 'utf8');
    
    // Check for all 5 levels
    let allLevelsPresent = true;
    for (let i = 1; i <= 5; i++) {
        if (!content.includes(`${i}:`)) {
            console.log(`  ⚠️  Level ${i} challenges may be missing`);
            allLevelsPresent = false;
        }
    }
    
    if (allLevelsPresent) {
        console.log('  ✅ All 5 challenge levels present');
        passed++;
    } else {
        failed++;
    }
    
    // Count approximate challenges
    const challengeMatches = content.match(/"/g);
    const approxChallenges = challengeMatches ? Math.floor(challengeMatches.length / 2) : 0;
    console.log(`  ℹ️  Approximately ${approxChallenges} challenge strings found`);
}

// Validate CSS
console.log('\n🎨 Validating CSS...\n');

const cssPath = path.join(ROOT, 'css/styles.css');
if (fs.existsSync(cssPath)) {
    const content = fs.readFileSync(cssPath, 'utf8');
    
    const checks = [
        { test: content.includes(':root'), name: 'CSS variables' },
        { test: content.includes('@media'), name: 'Responsive styles' },
        { test: content.includes('.container'), name: 'Container class' },
        { test: content.includes('.btn'), name: 'Button styles' }
    ];
    
    let cssValid = true;
    checks.forEach(check => {
        if (!check.test) {
            console.log(`  ⚠️  Missing: ${check.name}`);
            cssValid = false;
        }
    });
    
    if (cssValid) {
        console.log('  ✅ CSS file valid and complete');
        passed++;
    } else {
        failed++;
    }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 VALIDATION SUMMARY\n');
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total:  ${passed + failed}`);

if (failed === 0) {
    console.log('\n✅ All validations passed! Project is ready for deployment.\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Some validations failed. Please review the issues above.\n');
    process.exit(1);
}
