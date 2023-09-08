const { default: puppeteer } = require("puppeteer");
const { load } = require("cheerio");
const { writeFile, writeFileSync } = require("fs");

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1800, height: 1000 },
  });
  const page = await browser.newPage();
  await page.goto("https://www.myntra.com/");
  await page.type(
    "#desktop-header-cnt > div.desktop-bound > div.desktop-query > input",
    "women kurtas"
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
  (await page.$(".pagination-container")).scrollIntoView();
  await page.waitForTimeout(2000);
  const productsData = [];
  const $ = load(await page.content());
  $(
    "#desktopSearchResults > div.search-searchProductsContainer.row-base > section > ul > li"
  ).each((_, element) => {
    const name = $('[class="product-productMetaInfo"] h3', element).text();
    const brand = $(
      '[class="product-productMetaInfo"] [class="product-product"]',
      element
    ).text();
    const size = $(
      '[class="product-productMetaInfo"] [class="product-sizes"] [class="product-sizeInventoryPresent"]',
      element
    ).text();
    const price = $(
      '[class="product-productMetaInfo"] [class="product-price"] [class="product-discountedPrice"]',
      element
    ).text();
    // console.log(element);
    const container = $('[class="product-sliderContainer"] img', element);

    const img = $(container).attr("src");
    if (name != "" && brand != "" && size != "" && price != "" && img != "") {
      console.log({ name, brand, size, price, img });
    }
    productsData.push({
        name, brand, size, price, img
    });
  });
  //   await writeFile("./productdata.json", JSON.stringify(productsData));
  //   await browser.close();
};

main();
