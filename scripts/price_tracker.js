function displayProducts(){
    let template = document.getElementById("product_card");
    let target_div = document.getElementById("products_here");

    db.collection("sampleAPI")
        .onSnapshot(products => {
            let query = localStorage.getItem('query')

            let filteredProducts = [];
            products.forEach(doc => {
                if (doc.data().name.toLowerCase().includes(query.toLowerCase())){
                    filteredProducts.push(doc)
                }
            });

            if (filteredProducts.length <= 0){
                displayErrorMessage(
                    document.getElementById("content"), 
                    "We're sorry but " + query + " was not found in our database"
                );
            } else {
                populatePage (filteredProducts, template, target_div);
            }
        })
}

function sortPriceAsc() {
    let i = 0
    let itemList = []
    let products = document.querySelectorAll(".col")
    products.forEach(function(element){
        i += 1
        price = element.querySelector(".item_price").innerHTML;
        // element.setAttribute("id", i)
        itemList.push(element)
    })
    itemList.sort(function(a, b){
        price_1 = parseFloat(a.querySelector(".item_price").innerHTML)
        price_2 = parseFloat(b.querySelector(".item_price").innerHTML)
        return price_1 - price_2
    })
    let container = document.getElementById("products_here")
    let sortedCards = []
    for (let i = 0; i < itemList.length; i++) {
        card = itemList[i]
        sortedCards.push(card)
    }
    for (let i = 0; i < itemList.length; i++) {
        itemList[i].remove()
    }
    for (let i = 0; i < sortedCards.length; i++) {
        card = sortedCards[i]
        container.appendChild(card)
    }
}

function sortPriceDes() {
    let i = 0
    let itemList = []
    let products = document.querySelectorAll(".col")
    products.forEach(function(element){
        i += 1
        price = element.querySelector(".item_price").innerHTML;
        // element.setAttribute("id", i)
        itemList.push(element)
    })
    itemList.sort(function(a, b){
        price_1 = parseFloat(a.querySelector(".item_price").innerHTML)
        price_2 = parseFloat(b.querySelector(".item_price").innerHTML)
        return price_2 - price_1
    })
    let container = document.getElementById("products_here")
    let sortedCards = []
    for (let i = 0; i < itemList.length; i++) {
        card = itemList[i]
        sortedCards.push(card)
    }
    for (let i = 0; i < itemList.length; i++) {
        itemList[i].remove()
    }
    for (let i = 0; i < sortedCards.length; i++) {
        card = sortedCards[i]
        container.appendChild(card)
    }
}

// function describeProductInfo(){
//     console.log("Redirecting...");
//     let product_name = 

//     // window.location.assign("https://www.google.com/search?q=" + product_name);
// }

function displayQuery(){
    let query = localStorage.getItem('query');
    document.getElementById("search-bar").getAttributeNode("placeholder").value = "Results for " + query;
    console.log("Displayed query " + query);
}

function submitQuery(){
    let new_query = document.getElementById("search-bar").value;
    if (new_query != ''){
        localStorage.setItem("query", new_query);
        window.location.assign("price_tracker.html")
        console.log("Added " + new_query + " to 'query' key in local storage");
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    console.log("Page loaded!")
    displayProducts();
    displayQuery();
    // Search query event listeners
    document.getElementById("search-bar").addEventListener("keydown", (event) => {
        if (event.key == "Enter"){
            event.preventDefault();
            submitQuery();
        }
    });
    document.getElementById("search-btn-pt").addEventListener("click", submitQuery);
})

async function getCSVdata(){
    const response = await fetch('../sampleAPIdata.csv');
    const data = await response.text();
    const list = data.split('\n').slice(1);
    let index = 0;
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
            image: image,
            id: "item" + index
        })
        index++;
    })
    console.log("CSV added to firestore!");
}