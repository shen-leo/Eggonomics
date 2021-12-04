// Display search results if any.
function displayProducts(){
    let template = document.getElementById("product_card");
    let target_div = document.getElementById("products_here");

    db.collection("sampleAPI")
        .onSnapshot(products => {
            // get search query
            let query = localStorage.getItem('query')

            // filter sampleAPI products according to the search query
            let filteredProducts = [];
            products.forEach(doc => {
                if (doc.data().name.toLowerCase().includes(query.toLowerCase())){
                    filteredProducts.push(doc)
                }
            });

            // if there are no results, display an error message
            if (filteredProducts.length <= 0){
                displayErrorMessage(
                    document.getElementById("content"), 
                    "We're sorry but " + query + " was not found in our database"
                );
            } else {
                // if there are results, populate the page
                populatePage (filteredProducts, template, target_div);
            }
        })
}

//Show cards by price ascending order
function sortPriceAsc() {
    let i = 0
    let itemList = []
    // find the each products' prices by traversing the DOM
    let products = document.querySelectorAll(".col")
    products.forEach(function(element){
        i += 1
        price = element.querySelector(".item_price").innerHTML;
        itemList.push(element)
    })
    // sort all the prices from lowest to highest
    itemList.sort(function(a, b){
        price_1 = parseFloat(a.querySelector(".item_price").innerHTML.substr(1))
        price_2 = parseFloat(b.querySelector(".item_price").innerHTML.substr(1))
        return price_1 - price_2
    })
    // get the div that contains all the products and display them according to the itemList
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

//Show cards by price descending order
function sortPriceDes() {
    let i = 0
    let itemList = []
    // find the each products' prices by traversing the DOM
    let products = document.querySelectorAll(".col")
    products.forEach(function(element){
        i += 1
        price = element.querySelector(".item_price").innerHTML;
        itemList.push(element)
    })
    // sort all the prices from highest to lowest
    itemList.sort(function(a, b){
        price_1 = parseFloat(a.querySelector(".item_price").innerHTML.substr(1))
        price_2 = parseFloat(b.querySelector(".item_price").innerHTML.substr(1))
        return price_2 - price_1
    })
    // get the div that contains all the products and display them according to the itemList
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

// Display the query in the search bar
function displayQuery(){
    let query = localStorage.getItem('query');
    document.getElementById("search-bar").getAttributeNode("placeholder").value = "Results for " + query;
    console.log("Displayed query " + query);
}

// Submit another search query
function submitQuery(){
    let new_query = document.getElementById("search-bar").value;
    if (new_query != ''){
        localStorage.setItem("query", new_query);
        window.location.assign("price_tracker.html")
        console.log("Added " + new_query + " to 'query' key in local storage");
    }
}

// Wait for page load
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

// Populate the Firestore with the data from sampleAPIdata.csv
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