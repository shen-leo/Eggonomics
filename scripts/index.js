function submitQuery(){
    let new_query = document.getElementById("query").value;
    if (new_query != ''){
        localStorage.setItem("query", new_query);
        window.location.assign("price_tracker.html")
        console.log("Added " + query + " to 'query' key in local storage");
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    console.log("Page Loaded!")
    document.getElementById("query").addEventListener("keydown", (event) => {
        if (event.key == "Enter"){
            event.preventDefault();
            submitQuery();
        }
    });
    document.getElementById("submit-query").addEventListener("click", submitQuery);
    populateFavorites();
})

firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
        // Do something for the current logged-in user here: 
        console.log(user.uid);
        //go to the correct user document by referencing to the user uid
        currentUser = db.collection("users").doc(user.uid);
        //get the document for current user.
        currentUser.get()
            .then(userDoc => {
                localStorage.setItem('name', userDoc.data().name)
                localStorage.setItem('email', userDoc.data().email)
            })
    } else {
        // No user is signed in.
        console.log("no user");
    }
});

function populateFavorites(){
    let template = document.getElementById("favs");
    let target_div = document.getElementById("carousel");

    let uid = localStorage.getItem("ID");
    db.collection("favorite").doc(uid).get().then(function (doc) {
        let favs = doc.data().favorites
        if (favs.length == 0){
            console.log("empty list")
            let error_div = document.createElement("figure");
            error_div.setAttribute("id", "error-message");

            let img = document.createElement("img");
            img.setAttribute("src", "./img/logo.png");
            // img.setAttribute("")
            img.setAttribute("id", "error-img");

            let message = document.createElement("figcaption");
            message.setAttribute("id", "error-message-text")
            message.innerText = "Nothing yet!";

            error_div.appendChild(img);
            error_div.appendChild(message);
            target_div.appendChild(error_div);
        } else {
            db.collection("sampleAPI").where("id", "in", favs).get().then(products => {
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
                })
            })
        }
    })
    
}