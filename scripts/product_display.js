function populatePage (products, templateElement, targetElement){
    let index = 0;
    products.forEach(doc => {
        // get all item data
        let id = doc.data().id;

        let name = doc.data().name;
        let price = doc.data().price;
        let image = './img/sampleAPIimgs/' + doc.data().image;
        let manufacturer = doc.data().manufacturer;
        let retail = doc.data().retailer;
        let stock = doc.data().in_stock;

        let product_card = templateElement.content.cloneNode(true);
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
        targetElement.appendChild(product_card);

        index++;
    })
}

function displayErrorMessage(targetElement, error_message){
    console.log(error_message);
            
    let error_div = document.createElement("figure");
    error_div.setAttribute("id", "error-message");

    let img = document.createElement("img");
    img.setAttribute("src", "./img/logo.png");
    // img.setAttribute("")
    img.setAttribute("id", "error-img");

    let message = document.createElement("figcaption");
    message.setAttribute("id", "error-message-text")
    message.innerText = error_message;

    error_div.appendChild(img);
    error_div.appendChild(message);
    targetElement.appendChild(error_div);
}