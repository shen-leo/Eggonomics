var API = db.collection("sampleAPI")

function displayProducts(){
    let template = document.getElementById("product_card");
    let target_div = document.getElementById("products_here");

    API.get()
        .then(products => {
            products.forEach(doc => {
                let name = doc.data().name;
                let price = doc.data().price;
                let image = 'null';

                let product_card = template.content.cloneNode(true);
                product_card.querySelector("#item_name").innerHTML = name;
                product_card.querySelector("#item_price").innerHTML = price;
                target_div.appendChild(product_card);

            })
        })
}

displayProducts();

