const fs = require('fs');

const file = fs.createWriteStream('test_import.csv');

// En-têtes CSV
file.write("name,price,stock,description,isArchived\n");

for (let i = 0; i < 2500; i++) {
    const name = `Produit ${i}`;
    const price = (Math.random() * 100).toFixed(2);
    const stock = Math.floor(Math.random() * 50);
    const description = "Description automatique";
    const isArchived = false;

    file.write(`${name},${price},${stock},${description},${isArchived}\n`);
}

file.end(() => console.log("✅ test_import.csv généré avec 2500 lignes !"));
