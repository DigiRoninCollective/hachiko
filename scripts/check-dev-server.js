const { chromium } = require('playwright');

async function checkDevServer() {
  console.log('🔍 Checking Next.js development server...');
  
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the development server
    console.log('📍 Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'dev-server-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as dev-server-screenshot.png');
    
    // Check for errors in console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    // Check page title
    const title = await page.title();
    console.log('📄 Page Title:', title);
    
    // Check if Hachiko image is loaded - first scroll to the beginning
    await page.evaluate(() => {
      // Find the horizontal scroll container and scroll to the beginning
      const scrollContainer = document.querySelector('.overflow-x-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
      }
    });

    // Wait a moment for the scroll to complete
    await page.waitForTimeout(500);

    // Check if Hachiko image is loaded in the hero section
    const image = page.locator('img[alt="Hachiko"]');
    const imageExists = await image.count();
    console.log('🖼️ Hachiko Image Found:', imageExists > 0 ? '✅ Yes' : '❌ No');

    if (imageExists > 0) {
      const imageSrc = await image.getAttribute('src');
      console.log('🔗 Image Source:', imageSrc);
    } else {
      // If not found, try to find any image with 'hachiko' in the src
      const allImages = await page.locator('img').all();
      for (const img of allImages) {
        const src = await img.getAttribute('src');
        if (src && src.toLowerCase().includes('hachiko')) {
          console.log('🖼️ Hachiko-related image found:', '✅ Yes');
          console.log('🔗 Image Source:', src);
          break;
        }
      }
    }
    
    // Check for any error messages on the page
    const errorElements = await page.locator('text=/error|Error|ERROR').count();
    if (errorElements > 0) {
      console.log('⚠️ Error elements found on page:', errorElements);
    }
    
    // Wait a bit to see the page
    await page.waitForTimeout(5000);
    
    await browser.close();
    console.log('✅ Browser closed');
    
  } catch (error) {
    console.error('❌ Error checking dev server:', error.message);
  }
}

checkDevServer();
