function populatePage (products, templateElement, targetElement){
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
        product_card.querySelector(".item_price").innerText = `$${Number(price).toFixed(2)}`;
        product_card.querySelector(".img1").src = image;
        product_card.querySelector(".img2").src = image;

        product_card.querySelector(".item_figcap-name").innerText = name;
        product_card.querySelector(".item_price2").innerText = `$${Number(price).toFixed(2)}`;
        product_card.querySelector(".item_retail").innerText = retail;
        product_card.querySelector(".item_manu").innerText = manufacturer;
        product_card.querySelector(".item_quant").innerText = stock;
        
        // change all IDs
        product_card.querySelector(".item_card").id = id + "_card";
        product_card.querySelector(".item_name").id = id + "_name";
        product_card.querySelector(".item_price").id = id + "_price";

        product_card.querySelector(".item_modal-body").id = id + "_modal-body";
        // product_card.querySelector(".item_modal-name").id = "item" + id + "_modal-name";
        
        product_card.querySelector(".item_modal").id = id + "_modal";
        product_card.querySelector(".item_card").setAttribute("data-bs-target", "#" + id + "_modal");

        // event listeners
        product_card.querySelectorAll(".favorites").forEach(button => {
            button.addEventListener("click", () => {
                let uid = localStorage.getItem("ID");
                console.log('CLICK')
                let favos = db.collection("favorite").doc(uid);

                let item_id = button.parentNode.parentNode.parentNode.id.replace("_modal-body", "");
                console.log(item_id);

                favos.get().then(doc => {
                    let favosStored = doc.data().favorites;
                    if (favosStored.includes(item_id)){
                        console.log("DELETE")
                        favosStored.splice(favosStored.indexOf(item_id), 1);
                        console.log(favosStored)
                        favos.update({
                            favorites: favosStored
                        })
                        if (document.URL.includes("index.html")){
                            $(`#${item_id}_modal`).modal('hide');
                            document.querySelector(`#${item_id}_modal`).remove();
                            document.querySelector(`#${item_id}_card`).remove();
                        }
                    } else {
                        console.log("ADD")
                        favos.update({
                            favorites: firebase.firestore.FieldValue.arrayUnion(id)
                        })
                    }     
                })
            });
        });

        // append to target_div
        targetElement.appendChild(product_card);
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

