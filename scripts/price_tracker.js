var API = db.collection("sampleAPI")

function displayProducts(){
    let template = document.getElementById("product_card");
    let target_div = document.getElementById("products_here");

    API.get()
        .then(products => {
            products.forEach(doc => {
                let name = doc.data().name;
                let price = doc.data().price;
                let image = './img/sampleAPIimgs/' + doc.data().image;

                let query = localStorage.getItem('query').toLowerCase();
                let filter = name.toLowerCase();
                if(filter.includes(query)){
                    let product_card = template.content.cloneNode(true);
                    product_card.querySelector("#item_name").innerHTML = name;
                    product_card.querySelector("#item_price").innerHTML = price;
                    product_card.querySelector("#item_img").src = image;
                    target_div.appendChild(product_card);
                }
                

            })
        })
}

function displayQuery(){
    let query = localStorage.getItem('query');
    document.getElementById("search-bar").getAttributeNode("placeholder").value = "Results for " + query;
    console.log("Displayed query " + query);
}

function waitForSearchQuery(){
    document.getElementById("search-btn-pt").addEventListener("click", function(event){
        let new_query = document.getElementById("search-bar").value;
        if (new_query != ''){
            localStorage.setItem("query", new_query);
        }
        window.location.assign("price_tracker.html")
    })
}

document.addEventListener("DOMContentLoaded", function(event){
    console.log("Page loaded!")
    displayProducts();
    displayQuery();
    waitForSearchQuery();
})

async function getCSVdata(){
    const response = await fetch('../sampleAPIdata.csv');
    const data = await response.text();
    const list = data.split('\n').slice(1);
    list.forEach(row => {
        const columns = row.split(',');

        let name = columns[0];
        let price = parseFloat(columns[1]);
        let in_stock = parseInt(columns[2]);
        let retailer = columns[3];
        let manufacturer = columns[4];
        let image = columns[5]

        // for error handling
        // console.log(name, price, in_stock, retailer, manufacturer, image);

        db.collection("sampleAPI").add({
            name: name,
            price: price,
            in_stock: in_stock,
            retailer: retailer,
            manufacturer: manufacturer,
            image: image
        })
    })
    console.log("CSV added to firestore!");
}
