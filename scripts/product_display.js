// This is where we'll put our favorites data.
var favos;
var favosStored;

// Check if page is ready! Makes sure that favos initiates when coming in from a different page or directly from link
if (document.readyState != "loading"){
    ready()
} else {
    document.addEventListener("DOMContentLoaded", ready())
}

// async get() gets called on page load so that you don't have to get favorites over and over.
function ready(){
    let uid = localStorage.getItem("ID");
    favos = db.collection("favorite").doc(uid);
    favos.get().then(doc => {
        favosStored = doc.data().favorites;
    })
}

// Populate the page with dynamically added cards.
function populatePage (products, templateElement, targetElement){
    products.forEach(doc => {
        // get all item data
        let id = doc.data().id;

        let name = doc.data().name;
        let price = doc.data().price;
        let image = '/img/sampleAPIimgs/' + doc.data().image;
        let manufacturer = doc.data().manufacturer;
        let retail = doc.data().retailer;
        let stock = doc.data().in_stock;

        let product_card = templateElement.content.cloneNode(true);
        // change all texts
        product_card.querySelector(".item_name").innerText = name;
        product_card.querySelector(".item_price").innerText = `$${Number(price).toFixed(2)}`;
        product_card.querySelector(".img1").src = image;
        product_card.querySelector(".img2").src = image;

        product_card.querySelector(".item_figcap-name").innerText = name;
        product_card.querySelector(".item_price2").innerText = `$${Number(price).toFixed(2)}`;
        product_card.querySelector(".item_retail").innerText = retail;
        product_card.querySelector(".item_manu").innerText = manufacturer;
        product_card.querySelector(".item_quant").innerText = stock;
        let toggle = product_card.querySelector(".fav2");
        
        // change ids
        product_card.querySelector(".item_card").id = id + "_card";
        product_card.querySelector(".item_name").id = id + "_name";
        product_card.querySelector(".item_price").id = id + "_price";

        product_card.querySelector(".item_modal-body").id = id + "_modal-body";
        
        product_card.querySelector(".item_modal").id = id + "_modal";
        product_card.querySelector(".item_card").setAttribute("data-bs-target", "#" + id + "_modal");

        // check if an item is already in the favorites
        if (favosStored.includes(id)){
            toggle.classList.add("active");
            toggle.setAttribute("aria-pressed", true);
        }

        // make event listeners
        product_card.querySelectorAll(".favorites").forEach(button => {
            button.addEventListener("click", () => {
                if (favosStored.includes(id)){
                    // update favorites in the db (delete)
                    console.log("DELETE: " + id)
                    favosStored.splice(favosStored.indexOf(id), 1);
                    favos.update({
                        favorites: favosStored
                    })

                    // deactivate favorites button
                    toggle.classList.remove("active");
                    toggle.setAttribute("aria-pressed", false);

                    // delete the card and the modal only if we are on the main page.
                    if (document.URL.includes("main.html")){
                        $(`#${id}_modal`).modal('hide');
                        document.querySelector(`#${id}_modal`).remove();
                        document.querySelector(`#${id}_card`).remove();
                    }
                } else {
                    // update favorites in the db (add)
                    console.log("ADD: " + id)
                    favos.update({
                        favorites: firebase.firestore.FieldValue.arrayUnion(id)
                    })

                    // activate favorites button
                    toggle.classList.add("active");
                    toggle.setAttribute("aria-pressed", true);

                    favosStored.push(id)
                }     
            });
        });

        // append to target_div
        targetElement.appendChild(product_card);
    })
}

// Display a custom error message.
function displayErrorMessage(targetElement, error_message){
    console.log(error_message);
            
    // make error div message element
    let error_div = document.createElement("figure");
    error_div.setAttribute("id", "error-message");

    let img = document.createElement("img");
    img.setAttribute("src", "/img/logo.png");
    img.setAttribute("id", "error-img");

    let message = document.createElement("figcaption");
    message.setAttribute("id", "error-message-text")
    message.innerText = error_message;

    error_div.appendChild(img);
    error_div.appendChild(message);

    // append to target_div
    targetElement.appendChild(error_div);
}