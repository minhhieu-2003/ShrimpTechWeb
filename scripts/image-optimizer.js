#!/usr/bin/env node

/**
 * ShrimpTech Image Optimizer CLI
 * Batch optimization tool for images in the project
 */

const fs = require('fs').promises;
const path = require('path');

class ShrimpTechImageOptimizer {
    constructor() {
        this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
        this.optimizationResults = [];
        this.totalSizeBefore = 0;
        this.totalSizeAfter = 0;
    }
    
    /**
     * Scan directory for images
     */
    async scanForImages(directory) {
        console.log(`🔍 Scanning for images in: ${directory}`);
        
        const images = [];
        
        try {
            const scan = async (dir) => {
                const items = await fs.readdir(dir, { withFileTypes: true });
                
                for (const item of items) {
                    const fullPath = path.join(dir, item.name);
                    
                    if (item.isDirectory()) {
                        // Skip node_modules and other build directories
                        if (!['node_modules', '.git', 'dist', 'build', '.vscode'].includes(item.name)) {
                            await scan(fullPath);
                        }
                    } else if (item.isFile()) {
                        const ext = path.extname(item.name).toLowerCase();
                        if (this.supportedFormats.includes(ext)) {
                            const stats = await fs.stat(fullPath);
                            images.push({
                                path: fullPath,
                                name: item.name,
                                extension: ext,
                                size: stats.size,
                                directory: dir
                            });
                        }
                    }
                }
            };
            
            await scan(directory);
            
            console.log(`✅ Found ${images.length} images`);
            return images;
            
        } catch (error) {
            console.error(`❌ Error scanning directory: ${error.message}`);
            return [];
        }
    }
    
    /**
     * Analyze image optimization potential
     */
    async analyzeImages(images) {
        console.log('\n📊 Analyzing images for optimization potential...');
        
        const analysis = {
            totalImages: images.length,
            totalSize: 0,
            largeImages: [],
            unoptimizedFormats: [],
            duplicates: [],
            recommendations: []
        };
        
        const imageHashes = new Map();
        
        for (const image of images) {
            analysis.totalSize += image.size;
            
            // Check for large images (> 1MB)
            if (image.size > 1024 * 1024) {
                analysis.largeImages.push({
                    ...image,
                    sizeMB: (image.size / 1024 / 1024).toFixed(2)
                });
            }
            
            // Check for unoptimized formats
            if (['.jpg', '.jpeg', '.png'].includes(image.extension)) {
                analysis.unoptimizedFormats.push(image);
            }
            
            // Check for potential duplicates (same size and name pattern)
            const key = `${image.name}_${image.size}`;
            if (imageHashes.has(key)) {
                analysis.duplicates.push({
                    original: imageHashes.get(key),
                    duplicate: image
                });
            } else {
                imageHashes.set(key, image);
            }
        }
        
        // Generate recommendations
        if (analysis.largeImages.length > 0) {
            analysis.recommendations.push(`Optimize ${analysis.largeImages.length} large images (>1MB)`);
        }
        
        if (analysis.unoptimizedFormats.length > 0) {
            analysis.recommendations.push(`Convert ${analysis.unoptimizedFormats.length} images to WebP format`);
        }
        
        if (analysis.duplicates.length > 0) {
            analysis.recommendations.push(`Remove ${analysis.duplicates.length} potential duplicate images`);
        }
        
        // Display analysis
        this.displayAnalysis(analysis);
        
        return analysis;
    }
    
    /**
     * Display analysis results
     */
    displayAnalysis(analysis) {
        console.log('\n' + '='.repeat(60));
        console.log('📸 IMAGE ANALYSIS RESULTS');
        console.log('='.repeat(60));
        
        console.log(`📊 Total Images: ${analysis.totalImages}`);
        console.log(`💾 Total Size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB`);
        
        if (analysis.largeImages.length > 0) {
            console.log(`\n🚨 Large Images (>1MB): ${analysis.largeImages.length}`);
            analysis.largeImages.forEach(img => {
                console.log(`   📁 ${img.name} - ${img.sizeMB}MB`);
            });
        }
        
        if (analysis.unoptimizedFormats.length > 0) {
            console.log(`\n⚠️ Unoptimized Formats: ${analysis.unoptimizedFormats.length}`);
            const formatCounts = {};
            analysis.unoptimizedFormats.forEach(img => {
                formatCounts[img.extension] = (formatCounts[img.extension] || 0) + 1;
            });
            Object.entries(formatCounts).forEach(([format, count]) => {
                console.log(`   📄 ${format}: ${count} images`);
            });
        }
        
        if (analysis.duplicates.length > 0) {
            console.log(`\n🔍 Potential Duplicates: ${analysis.duplicates.length}`);
            analysis.duplicates.forEach(dup => {
                console.log(`   📁 ${dup.original.name} ≈ ${dup.duplicate.name}`);
            });
        }
        
        if (analysis.recommendations.length > 0) {
            console.log(`\n💡 Recommendations:`);
            analysis.recommendations.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec}`);
            });
        } else {
            console.log(`\n✅ All images are well optimized!`);
        }
    }
    
    /**
     * Generate optimized image suggestions
     */
    async generateOptimizationPlan(images, analysis) {
        console.log('\n🔧 Generating optimization plan...');
        
        const plan = {
            compressionTargets: [],
            formatConversions: [],
            resizeTargets: [],
            duplicateRemovals: [],
            estimatedSavings: 0
        };
        
        // Identify compression targets
        analysis.largeImages.forEach(img => {
            const estimatedSaving = img.size * 0.3; // Estimate 30% compression
            plan.compressionTargets.push({
                ...img,
                estimatedSaving: estimatedSaving,
                newSize: img.size - estimatedSaving
            });
            plan.estimatedSavings += estimatedSaving;
        });
        
        // Identify format conversion candidates
        analysis.unoptimizedFormats.forEach(img => {
            const estimatedSaving = img.size * 0.25; // Estimate 25% saving with WebP
            plan.formatConversions.push({
                ...img,
                targetFormat: '.webp',
                estimatedSaving: estimatedSaving,
                newSize: img.size - estimatedSaving
            });
            plan.estimatedSavings += estimatedSaving;
        });
        
        // Identify resize targets (images larger than typical web use)
        images.forEach(img => {
            // This is a simplified check - in reality you'd check actual image dimensions
            if (img.size > 500 * 1024 && !analysis.largeImages.includes(img)) {
                const estimatedSaving = img.size * 0.4; // Estimate 40% saving with resize
                plan.resizeTargets.push({
                    ...img,
                    estimatedSaving: estimatedSaving,
                    newSize: img.size - estimatedSaving
                });
                plan.estimatedSavings += estimatedSaving;
            }
        });
        
        // Add duplicate removals
        plan.duplicateRemovals = analysis.duplicates.map(dup => ({
            ...dup.duplicate,
            estimatedSaving: dup.duplicate.size
        }));
        plan.estimatedSavings += plan.duplicateRemovals.reduce((sum, dup) => sum + dup.estimatedSaving, 0);
        
        this.displayOptimizationPlan(plan);
        
        return plan;
    }
    
    /**
     * Display optimization plan
     */
    displayOptimizationPlan(plan) {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 OPTIMIZATION PLAN');
        console.log('='.repeat(60));
        
        if (plan.compressionTargets.length > 0) {
            console.log(`\n🗜️ Compression Targets: ${plan.compressionTargets.length}`);
            plan.compressionTargets.forEach(img => {
                console.log(`   📁 ${img.name} - Save ~${(img.estimatedSaving / 1024 / 1024).toFixed(2)}MB`);
            });
        }
        
        if (plan.formatConversions.length > 0) {
            console.log(`\n🔄 Format Conversions: ${plan.formatConversions.length}`);
            plan.formatConversions.forEach(img => {
                console.log(`   📄 ${img.name} → WebP - Save ~${(img.estimatedSaving / 1024 / 1024).toFixed(2)}MB`);
            });
        }
        
        if (plan.resizeTargets.length > 0) {
            console.log(`\n📏 Resize Targets: ${plan.resizeTargets.length}`);
            plan.resizeTargets.forEach(img => {
                console.log(`   📐 ${img.name} - Save ~${(img.estimatedSaving / 1024 / 1024).toFixed(2)}MB`);
            });
        }
        
        if (plan.duplicateRemovals.length > 0) {
            console.log(`\n🗑️ Duplicate Removals: ${plan.duplicateRemovals.length}`);
            plan.duplicateRemovals.forEach(img => {
                console.log(`   🗂️ ${img.name} - Save ${(img.estimatedSaving / 1024 / 1024).toFixed(2)}MB`);
            });
        }
        
        console.log(`\n💰 Total Estimated Savings: ${(plan.estimatedSavings / 1024 / 1024).toFixed(2)} MB`);
        
        if (plan.estimatedSavings === 0) {
            console.log(`\n✅ No optimization needed - images are already well optimized!`);
        }
    }
    
    /**
     * Create optimization commands
     */
    generateOptimizationCommands(plan) {
        console.log('\n' + '='.repeat(60));
        console.log('🛠️ OPTIMIZATION COMMANDS');
        console.log('='.repeat(60));
        
        const commands = [];
        
        // ImageMagick commands for compression
        if (plan.compressionTargets.length > 0) {
            console.log('\n🗜️ Compression Commands (using ImageMagick):');
            plan.compressionTargets.forEach(img => {
                const cmd = `magick "${img.path}" -quality 85 -strip "${img.path}"`;
                commands.push(cmd);
                console.log(`   ${cmd}`);
            });
        }
        
        // WebP conversion commands
        if (plan.formatConversions.length > 0) {
            console.log('\n🔄 WebP Conversion Commands:');
            plan.formatConversions.forEach(img => {
                const webpPath = img.path.replace(img.extension, '.webp');
                const cmd = `cwebp "${img.path}" -o "${webpPath}" -q 85`;
                commands.push(cmd);
                console.log(`   ${cmd}`);
            });
        }
        
        // Resize commands
        if (plan.resizeTargets.length > 0) {
            console.log('\n📏 Resize Commands (using ImageMagick):');
            plan.resizeTargets.forEach(img => {
                const cmd = `magick "${img.path}" -resize 1920x1080> -quality 85 "${img.path}"`;
                commands.push(cmd);
                console.log(`   ${cmd}`);
            });
        }
        
        // Duplicate removal commands
        if (plan.duplicateRemovals.length > 0) {
            console.log('\n🗑️ Duplicate Removal Commands:');
            plan.duplicateRemovals.forEach(img => {
                const cmd = `del "${img.path}"`;
                commands.push(cmd);
                console.log(`   ${cmd}`);
            });
        }
        
        return commands;
    }
    
    /**
     * Generate batch script for Windows
     */
    async generateBatchScript(commands, plan) {
        if (commands.length === 0) {
            console.log('\n✅ No optimization commands to generate');
            return;
        }
        
        const batchContent = `@echo off
REM ShrimpTech Image Optimization Script
REM Generated on ${new Date().toISOString()}
REM Estimated savings: ${(plan.estimatedSavings / 1024 / 1024).toFixed(2)} MB

echo Starting image optimization...
echo.

REM Check if ImageMagick is installed
where magick >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ImageMagick not found!
    echo Please install ImageMagick from https://imagemagick.org/
    pause
    exit /b 1
)

REM Check if cwebp is installed
where cwebp >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: cwebp not found!
    echo WebP conversion will be skipped
    echo Install WebP tools from https://developers.google.com/speed/webp/download
)

echo Starting optimization...
echo.

${commands.map((cmd, index) => `
echo [${index + 1}/${commands.length}] Processing...
${cmd}
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Command failed
) else (
    echo SUCCESS
)
echo.`).join('')}

echo.
echo Optimization complete!
echo Check the results and verify image quality before deployment.
pause
`;
        
        const scriptPath = path.join(process.cwd(), 'optimize-images.bat');
        
        try {
            await fs.writeFile(scriptPath, batchContent);
            console.log(`\n✅ Batch script generated: ${scriptPath}`);
            console.log('\n📋 To run optimization:');
            console.log(`   1. Install ImageMagick: https://imagemagick.org/`);
            console.log(`   2. Install WebP tools: https://developers.google.com/speed/webp/download`);
            console.log(`   3. Run: optimize-images.bat`);
        } catch (error) {
            console.error(`❌ Failed to generate batch script: ${error.message}`);
        }
    }
    
    /**
     * Generate HTML report
     */
    async generateHTMLReport(images, analysis, plan) {
        const reportHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShrimpTech Image Optimization Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .summary { background: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
        .metric-value { font-size: 2em; font-weight: bold; color: #3498db; }
        .metric-label { color: #7f8c8d; }
        .recommendations { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .plan-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; }
        .savings { color: #27ae60; font-weight: bold; }
        .large-image { color: #e74c3c; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #3498db; color: white; }
        .file-path { font-family: monospace; font-size: 0.9em; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 ShrimpTech Image Optimization Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${analysis.totalImages}</div>
                <div class="metric-label">Total Images</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(analysis.totalSize / 1024 / 1024).toFixed(2)}</div>
                <div class="metric-label">Total Size (MB)</div>
            </div>
            <div class="metric">
                <div class="metric-value">${(plan.estimatedSavings / 1024 / 1024).toFixed(2)}</div>
                <div class="metric-label">Potential Savings (MB)</div>
            </div>
            <div class="metric">
                <div class="metric-value">${analysis.largeImages.length}</div>
                <div class="metric-label">Large Images (>1MB)</div>
            </div>
        </div>
        
        ${analysis.recommendations.length > 0 ? `
        <div class="recommendations">
            <h3>💡 Recommendations</h3>
            <ul>
                ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${analysis.largeImages.length > 0 ? `
        <h2>🚨 Large Images (>1MB)</h2>
        <table>
            <tr><th>Image</th><th>Size</th><th>Path</th></tr>
            ${analysis.largeImages.map(img => `
                <tr>
                    <td>${img.name}</td>
                    <td class="large-image">${img.sizeMB} MB</td>
                    <td class="file-path">${img.path}</td>
                </tr>
            `).join('')}
        </table>
        ` : ''}
        
        ${plan.compressionTargets.length > 0 ? `
        <h2>🗜️ Compression Targets</h2>
        ${plan.compressionTargets.map(img => `
            <div class="plan-item">
                <strong>${img.name}</strong><br>
                Current: ${(img.size / 1024 / 1024).toFixed(2)} MB → 
                Estimated: ${(img.newSize / 1024 / 1024).toFixed(2)} MB
                <span class="savings">(Save ${(img.estimatedSaving / 1024 / 1024).toFixed(2)} MB)</span>
                <div class="file-path">${img.path}</div>
            </div>
        `).join('')}
        ` : ''}
        
        ${plan.formatConversions.length > 0 ? `
        <h2>🔄 Format Conversions to WebP</h2>
        ${plan.formatConversions.map(img => `
            <div class="plan-item">
                <strong>${img.name}</strong> → ${img.name.replace(img.extension, '.webp')}<br>
                Current: ${(img.size / 1024 / 1024).toFixed(2)} MB → 
                Estimated: ${(img.newSize / 1024 / 1024).toFixed(2)} MB
                <span class="savings">(Save ${(img.estimatedSaving / 1024 / 1024).toFixed(2)} MB)</span>
                <div class="file-path">${img.path}</div>
            </div>
        `).join('')}
        ` : ''}
        
        <h2>📊 All Images</h2>
        <table>
            <tr><th>Name</th><th>Format</th><th>Size (KB)</th><th>Path</th></tr>
            ${images.map(img => `
                <tr>
                    <td>${img.name}</td>
                    <td>${img.extension}</td>
                    <td>${(img.size / 1024).toFixed(1)}</td>
                    <td class="file-path">${img.path}</td>
                </tr>
            `).join('')}
        </table>
        
        <p style="margin-top: 30px; color: #7f8c8d; font-style: italic;">
            Report generated by ShrimpTech Image Optimizer CLI
        </p>
    </div>
</body>
</html>`;
        
        const reportPath = path.join(process.cwd(), 'image-optimization-report.html');
        
        try {
            await fs.writeFile(reportPath, reportHTML);
            console.log(`\n✅ HTML report generated: ${reportPath}`);
        } catch (error) {
            console.error(`❌ Failed to generate HTML report: ${error.message}`);
        }
    }
    
    /**
     * Main execution function
     */
    async run() {
        console.log('🚀 ShrimpTech Image Optimizer CLI');
        console.log('==================================\n');
        
        const projectDir = process.cwd();
        console.log(`📁 Project Directory: ${projectDir}`);
        
        try {
            // Scan for images
            const images = await this.scanForImages(projectDir);
            
            if (images.length === 0) {
                console.log('✅ No images found to optimize');
                return;
            }
            
            // Analyze images
            const analysis = await this.analyzeImages(images);
            
            // Generate optimization plan
            const plan = await this.generateOptimizationPlan(images, analysis);
            
            // Generate optimization commands
            const commands = this.generateOptimizationCommands(plan);
            
            // Generate batch script
            await this.generateBatchScript(commands, plan);
            
            // Generate HTML report
            await this.generateHTMLReport(images, analysis, plan);
            
            console.log('\n' + '='.repeat(60));
            console.log('✅ OPTIMIZATION ANALYSIS COMPLETE');
            console.log('='.repeat(60));
            console.log('📄 Files generated:');
            console.log('   - optimize-images.bat (Optimization script)');
            console.log('   - image-optimization-report.html (Detailed report)');
            console.log('\n💡 Next steps:');
            console.log('   1. Review the HTML report');
            console.log('   2. Install required tools (ImageMagick, WebP)');
            console.log('   3. Run optimize-images.bat');
            console.log('   4. Test optimized images');
            
        } catch (error) {
            console.error(`❌ Optimization failed: ${error.message}`);
            process.exit(1);
        }
    }
}

// Run the optimizer if called directly
if (require.main === module) {
    const optimizer = new ShrimpTechImageOptimizer();
    optimizer.run().catch(console.error);
}

module.exports = ShrimpTechImageOptimizer;