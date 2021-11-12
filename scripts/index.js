function submitForm(){
    document.getElementById("submit-query").addEventListener("click", function(event){
        console.log("Hello!")
        let query = document.getElementById("query").value;
        localStorage.setItem('query', query)

        console.log("Added " + query + " to 'query' key in local storage");

        window.location.assign("../price_tracker.html")
    })
}


document.addEventListener("DOMContentLoaded", function(event){
    console.log("Page Loaded!")
    submitForm();
})