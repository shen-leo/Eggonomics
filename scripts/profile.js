        var currentUser;

        function populateInfo() {
        firebase.auth().onAuthStateChanged((user) => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get().then((userDoc) => {
            //get the data fields of the user
            var userName = userDoc.data().name;
            //console.log(userName)
            var userEmail = userDoc.data().email;

            //if the data fields are not empty, then write them in to the form.
            if (userName != null) {
                document.getElementById("nameInput").value = userName;
            }
            if (userEmail != null) {
                document.getElementById("emailInput").value = userEmail;
            }
            });
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
        });
        }

        populateInfo();

        function editUserInfo(){
            //console.log("edit is clicked")
            document.getElementById("personalInfoFields").disabled = false;
        }

        function saveUserInfo(){
            //console.log("save is clicked")
            
            //grab values from the form that the user inserted in each field
            username = document.getElementById('nameInput').value;
            email = document.getElementById('emailInput').value;

        //   console.log("values are: ", name, school, city)
        
        // write the values in database
        currentUser.update({
            name: username,
            email: email

        })
        document.getElementById("personalInfoFields").disabled = true;
        }     


        // Confirmation Modal
        var modal = document.getElementById("myModal");

        var btn = document.getElementById("save");

        var span = document.getElementsByClassName("close")[0];

        btn.onclick = function() {
        modal.style.display = "block";
        }

        span.onclick = function() {
        modal.style.display = "none";
        }

        window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        }