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

function displayQuery(){
    let query = localStorage.getItem('query');
    document.getElementById("search-bar").getAttributeNode("placeholder").value = "Results for " + query;
    console.log("Displayed query " + query);
}

function waitForSearchQuery(){
    document.getElementById("search-btn-pt").addEventListener("click", function(event){
        let new_query = document.getElementById("search-bar").value;
        localStorage.setItem("query", new_query);

        window.location.assign("price_tracker.html")
    })
}

document.addEventListener("DOMContentLoaded", function(event){
    console.log("Page loaded!")
    displayProducts();
    displayQuery();
    waitForSearchQuery();
})
