const puppeteer = require('puppeteer');

(async () => {
    // Lancement du navigateur (headless: false permet de le voir s'ouvrir)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const pageUrl = "http://books.toscrape.com/";

    // Navigation
    await page.goto(pageUrl);

    // Cette fonction s'exécute DANS la page web, pas dans votre terminal
    const result = await page.evaluate((pageUrl) => {
        // Code JavaScript standard (comme dans la console Chrome)
        const titre = document.title;
        const produits = document.querySelectorAll('article.product_pod');
        

        // for each produits -> produit
        const titreLivre = document.querySelectorAll('h3 a');
        const prixLivre = document.querySelectorAll('div .price_color');
        const stockLivre = document.querySelectorAll('div p.instock.availability'); // y a <i> et le texte

        const produitsCnt = produits.length;     
        // Pour retourner des données vers Node.js
        return {
        titrePage: titre,
        nombreproduits: produitsCnt
        };
    });

    const data = await page.evaluate((pageUrl) => {
            const results = [];
            // On récupère TOUS les articles
            const elements = document.querySelectorAll('article.product_pod');
            elements.forEach(element => {
                const titleRaw = element.querySelector('h3 a').getAttribute('title');
                const priceRaw = element.querySelector('.price_color').innerText;
                const stockRaw = element.querySelector('.instock.availability').innerText;
                const imgRaw =  element.querySelector('.image_container img').getAttribute('src');
                results.push({
                    title: titleRaw,
                    price: priceRaw.replace('£', ''),
                    stock: stockRaw.trim(),
                    url: pageUrl + imgRaw,
                });
            });
            return results;
    }, pageUrl);

    console.log(data);
    await browser.close();
})();