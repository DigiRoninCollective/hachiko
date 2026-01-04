const { chromium } = require('playwright');

async function scrapeHachikoImages() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🐕 Starting Hachiko image scraping...');
  
  // Array of search terms and URLs to scrape from
  const imageSources = [
    {
      query: 'Hachiko dog statue Shibuya Station',
      source: 'google',
      count: 5
    },
    {
      query: 'Hachiko Akita dog historical photos',
      source: 'google', 
      count: 5
    },
    {
      query: 'Hachiko memorial Tokyo',
      source: 'google',
      count: 5
    }
  ];
  
  const downloadedImages = [];
  
  for (const source of imageSources) {
    console.log(`🔍 Searching for: ${source.query}`);
    
    // Go to Google Images
    await page.goto('https://images.google.com');
    
    // Accept cookies if any
    try {
      await page.click('button:has-text("Accept all")');
      await page.waitForTimeout(1000);
    } catch (e) {
      // No cookies button, continue
    }
    
    // Search for images
    const searchBox = await page.locator('input[name="q"]');
    await searchBox.fill(source.query);
    await searchBox.press('Enter');
    await page.waitForTimeout(2000);
    
    // Scroll to load more images
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('End');
      await page.waitForTimeout(1000);
    }
    
    // Get image elements
    const imageElements = await page.locator('img[src*="gstatic.com"], img[src*="encrypted-tbn0"]').all();
    
    console.log(`Found ${imageElements.length} images for: ${source.query}`);
    
    // Download first few images
    for (let i = 0; i < Math.min(source.count, imageElements.length); i++) {
      try {
        const img = imageElements[i];
        const src = await img.getAttribute('src');
        
        if (src && (src.includes('gstatic.com') || src.includes('encrypted-tbn0'))) {
          // Go to the image URL
          const imagePage = await browser.newPage();
          await imagePage.goto(src);
          
          // Get the actual image
          const imageElement = await imagePage.locator('img').first();
          const imageSrc = await imageElement.getAttribute('src');
          
          if (imageSrc && !imageSrc.includes('data:image')) {
            // Download the image
            const response = await imagePage.goto(imageSrc);
            const buffer = await response.body();
            
            const filename = `hachiko-${source.query.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${i + 1}.jpg`;
            const fs = require('fs');
            
            fs.writeFileSync(filename, buffer);
            downloadedImages.push(filename);
            console.log(`✅ Downloaded: ${filename}`);
          }
          
          await imagePage.close();
        }
      } catch (error) {
        console.log(`❌ Error downloading image ${i + 1}:`, error.message);
      }
    }
    
    await page.waitForTimeout(2000);
  }
  
  await browser.close();
  
  console.log(`\n🎉 Scraping complete! Downloaded ${downloadedImages.length} images:`);
  downloadedImages.forEach(img => console.log(`  - ${img}`));
  
  return downloadedImages;
}

// Alternative: Scrape from specific Hachiko websites
async function scrapeFromHachikoWebsites() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const websites = [
    'https://en.wikipedia.org/wiki/Hachiko',
    'https://www.shibuyastation.org/hachiko/',
    'https://www.tokyo-japan.com/travel/shibuya/hachiko-statue/'
  ];
  
  const downloadedImages = [];
  
  for (const website of websites) {
    console.log(`🌐 Scraping: ${website}`);
    
    try {
      await page.goto(website, { waitUntil: 'networkidle' });
      
      // Find all images
      const images = await page.locator('img').all();
      
      for (let i = 0; i < Math.min(3, images.length); i++) {
        try {
          const img = images[i];
          const src = await img.getAttribute('src');
          
          if (src && src.startsWith('http') && !src.includes('data:image')) {
            const response = await page.goto(src);
            const buffer = await response.body();
            
            const urlParts = new URL(src);
            const filename = `hachiko-${urlParts.hostname.replace(/[^a-zA-Z0-9]/g, '-')}-${i + 1}.jpg`;
            const fs = require('fs');
            
            fs.writeFileSync(filename, buffer);
            downloadedImages.push(filename);
            console.log(`✅ Downloaded: ${filename}`);
          }
        } catch (error) {
          console.log(`❌ Error downloading image:`, error.message);
        }
      }
    } catch (error) {
      console.log(`❌ Error scraping ${website}:`, error.message);
    }
  }
  
  await browser.close();
  
  console.log(`\n🎉 Website scraping complete! Downloaded ${downloadedImages.length} images:`);
  downloadedImages.forEach(img => console.log(`  - ${img}`));
  
  return downloadedImages;
}

// Run the scraper
if (require.main === module) {
  scrapeHachikoImages().catch(console.error);
}
