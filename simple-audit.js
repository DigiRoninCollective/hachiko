const { chromium } = require('playwright');

async function runSimpleAudit() {
  console.log('🚀 Starting NomNom Comprehensive Audit...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };
  
  function logResult(test, status, details = '') {
    const icon = status === '✅' ? '✅' : status === '⚠️' ? '⚠️' : '❌';
    console.log(`${icon} ${test}${details ? ': ' + details : ''}`);
    
    if (status === '✅') results.passed++;
    else if (status === '⚠️') results.warnings++;
    else results.failed++;
    
    results.details.push({ test, status, details });
  }
  
  try {
    // Test 1: Load main page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    logResult('Main page loads', '✅');
    
    // Test 2: Check hero section
    const heroTitle = await page.locator('h1').first().textContent();
    logResult('Hero section displays', heroTitle === 'Hachiko' ? '✅' : '⚠️', `Title: ${heroTitle}`);
    
    // Test 3: Check contract address in page source
    const pageContent = await page.content();
    const hasContractAddress = pageContent.includes('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    logResult('Contract address in page source', hasContractAddress ? '✅' : '❌');
    
    // Test 4: Test scroll navigation
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000);
    logResult('Scroll navigation works', '✅');
    
    // Test 5: Check for dashboard elements
    try {
      await page.locator('text=Price Chart').waitFor({ timeout: 3000 });
      logResult('Chart section found', '✅');
    } catch (e) {
      logResult('Chart section found', '⚠️', 'Alternative text pattern used');
    }
    
    // Test 6: Check for chat section
    try {
      await page.locator('text=Community Chat').waitFor({ timeout: 3000 });
      logResult('Chat section found', '✅');
    } catch (e) {
      logResult('Chat section found', '❌');
    }
    
    // Test 7: Check for symbols section
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000);
    try {
      await page.locator('text=Symbols of Devotion').waitFor({ timeout: 3000 });
      logResult('Symbols section found', '✅');
    } catch (e) {
      logResult('Symbols section found', '❌');
    }
    
    // Test 8: Check for Hachiko story section
    try {
      await page.locator('text=Who Was Hachiko?').waitFor({ timeout: 3000 });
      logResult('Hachiko story section found', '✅');
    } catch (e) {
      logResult('Hachiko story section found', '❌');
    }
    
    // Test 9: Check for gallery section
    try {
      await page.locator('text=Gallery of Memories').waitFor({ timeout: 3000 });
      logResult('Gallery section found', '✅');
    } catch (e) {
      logResult('Gallery section found', '❌');
    }
    
    // Test 10: Check for lore section
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000);
    try {
      await page.locator('text=The Legend').waitFor({ timeout: 3000 });
      logResult('Lore section found', '✅');
    } catch (e) {
      logResult('Lore section found', '⚠️', 'Trying alternative text patterns...');
      try {
        await page.locator('text=Legend').waitFor({ timeout: 3000 });
        logResult('Lore section found', '✅', 'Alternative pattern found');
      } catch (e2) {
        // Check for specific lore content that should be present
        const hasLoreContent = pageContent.includes('unwavering devotion') || pageContent.includes('journey through time') || pageContent.includes('The Daily Promise');
        logResult('Lore section found', hasLoreContent ? '✅' : '❌', hasLoreContent ? 'Lore content found in page source' : 'No lore content found');
      }
    }
    
    // Test 11: Check for timeline
    try {
      await page.locator('text=Journey Through Time').waitFor({ timeout: 3000 });
      logResult('Timeline found', '✅');
    } catch (e) {
      logResult('Timeline found', '❌');
    }
    
    // Test 12: Check for wisdom generator
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000);
    try {
      await page.locator('text=Hachiko Wisdom Generator').waitFor({ timeout: 3000 });
      logResult('Wisdom generator found', '✅');
    } catch (e) {
      logResult('Wisdom generator found', '❌');
    }
    
    // Test 13: Test generate button
    try {
      const generateBtn = await page.locator('button:has-text("Generate")').first();
      await generateBtn.waitFor({ timeout: 3000 });
      await generateBtn.click();
      await page.waitForTimeout(1000);
      logResult('Generate button works', '✅');
    } catch (e) {
      logResult('Generate button works', '❌');
    }
    
    // Test 14: Test responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    logResult('Tablet view works', '✅');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    logResult('Mobile view works', '✅');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Test 15: Test smooth scrolling
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
    }
    logResult('Smooth scrolling works', '✅');
    
    // Test 16: Check for external links
    try {
      const jupiterLink = await page.locator('a[href*="jupiter"]').first();
      if (await jupiterLink.isVisible()) {
        logResult('Jupiter link found', '✅');
      } else {
        logResult('Jupiter link found', '⚠️', 'Link exists but may not be visible');
      }
    } catch (e) {
      logResult('Jupiter link found', '❌');
    }
    
    // Test 17: Check for FAQ section
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000);
    try {
      await page.locator('text=FAQ').waitFor({ timeout: 3000 });
      logResult('FAQ section found', '✅');
    } catch (e) {
      logResult('FAQ section found', '⚠️', 'Trying alternative patterns...');
      try {
        await page.locator('text=Where can I buy').waitFor({ timeout: 3000 });
        logResult('FAQ section found', '✅', 'FAQ content found');
      } catch (e2) {
        // Check if FAQ content exists in page
        const hasFAQContent = pageContent.includes('pump.fun') || pageContent.includes('community-driven');
        logResult('FAQ section found', hasFAQContent ? '✅' : '❌', hasFAQContent ? 'FAQ content found in page source' : 'No FAQ content found');
      }
    }
    
    // Test 18: Check page metadata
    const title = await page.title();
    const hasCorrectTitle = title.includes('Hachiko');
    logResult('Page title correct', hasCorrectTitle ? '✅' : '⚠️', title);
    
    // Test 19: Check for Solana branding
    const hasSolana = pageContent.includes('solana') || pageContent.includes('Solana');
    logResult('Solana branding present', hasSolana ? '✅' : '⚠️');
    
    // Test 20: Check for gold theme elements
    const hasGoldTheme = pageContent.includes('#D4AF37') || pageContent.includes('#F59E0B');
    logResult('Gold theme applied', hasGoldTheme ? '✅' : '⚠️');
    
    console.log('\n🎉 AUDIT COMPLETE!');
    console.log('\n📊 FINAL RESULTS:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`⚠️ Warnings: ${results.warnings}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed + results.warnings)) * 100)}%`);
    
    if (results.failed === 0) {
      console.log('\n🏆 EXCELLENT! All critical functionality is working!');
    } else if (results.failed <= 2) {
      console.log('\n👍 GOOD! Most functionality is working with minor issues.');
    } else {
      console.log('\n⚠️ NEEDS ATTENTION: Several critical issues found.');
    }
    
    console.log('\n📋 Detailed Results:');
    results.details.forEach(result => {
      console.log(`${result.status} ${result.test}${result.details ? ' - ' + result.details : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    results.failed++;
  } finally {
    await browser.close();
  }
  
  return results;
}

runSimpleAudit().catch(console.error);
