var API = db.collection("sampleAPI")

function displayProducts(){
    let template = document.getElementById("product_card");
    let target_div = document.getElementById("products_here");

    API.get()
        .then(products => {
            let index = 0;
            products.forEach(doc => {
                let id = doc.data().id;

                let name = doc.data().name;
                let price = doc.data().price;
                let image = './img/sampleAPIimgs/' + doc.data().image;
                let manufacturer = doc.data().manufacturer;
                let retail = doc.data().retailer;
                let stock = doc.data().in_stock;

                let query = localStorage.getItem('query').toLowerCase();
                let filter = name.toLowerCase();
                if(filter.includes(query)){
                    let product_card = template.content.cloneNode(true);

                    // change all texts
                    product_card.querySelector(".item_name").innerText = name;
                    product_card.querySelector(".item_price").innerText = price;
                    product_card.querySelector(".img1").src = image;
                    product_card.querySelector(".img2").src = image;

                    product_card.querySelector(".item_figcap-name").innerText = name;
                    product_card.querySelector(".item_price2").innerText = price;
                    product_card.querySelector(".item_retail").innerText = retail;
                    product_card.querySelector(".item_manu").innerText = manufacturer;
                    product_card.querySelector(".item_quant").innerText = stock;
                    
                    // change all IDs
                    product_card.querySelector(".item_card").id = "item" + index + "_card";
                    product_card.querySelector(".item_name").id = "item" + index + "_name";
                    product_card.querySelector(".item_price").id = "item" + index + "_price";

                    product_card.querySelector(".item_modal-body").id = "item" + index + "_modal-body";
                    // product_card.querySelector(".item_modal-name").id = "item" + index + "_modal-name";
                    
                    product_card.querySelector(".item_modal").id = "item" + index + "_modal";
                    product_card.querySelector(".item_card").setAttribute("data-bs-target", "#item" + index + "_modal");

                    // event listener
                    product_card.querySelector(".favorites").addEventListener("click", () => {
                        let uid = localStorage.getItem("ID");
                        db.collection("favorite").doc(uid).update({
                            favorites: firebase.firestore.FieldValue.arrayUnion(id)
                        });
                    });

                    // append to target_div
                    target_div.appendChild(product_card);

                    index++;
                }
            })
            // console.log("Length", target_div.childElementCount);
            if (target_div.childElementCount == 0){
                console.log("Search query found no data.");

                let error_div = document.createElement("figure");
                error_div.setAttribute("id", "error-message");

                let img = document.createElement("img");
                img.setAttribute("src", "./img/logo.png");
                // img.setAttribute("")
                img.setAttribute("id", "error-img");

                let message = document.createElement("figcaption");
                message.setAttribute("id", "error-message-text")
                message.innerText = "We're sorry but " + localStorage.getItem('query') + " was not found in our database";

                error_div.appendChild(img);
                error_div.appendChild(message);
                document.getElementById("content").appendChild(error_div);
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