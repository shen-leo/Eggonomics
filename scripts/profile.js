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

function editUserInfo() {
    console.log("edit is clicked")
    document.getElementById("personalInfoFields").disabled = false;
}

function saveUserInfo() {
    console.log("save is clicked")

    //grab values from the form that the user inserted in each field
    username = document.getElementById('nameInput').value;
    email = document.getElementById('emailInput').value;

    //   console.log("values are: ", name, school, city)

    // write the values in database
    console.log(currentUser)
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

// btn.onclick = function () {
//     modal.style.display = "block";
//     saveUserInfo();
// }

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.assign("login.html")
    }).catch((error) => {
        // An error happened.
    });
}


// function savePic() {
//     let defaultPic = 
//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//           let ref = db.collection("users").doc(user.uid);
//           ref.get().then((res) => {
//             if (!res.exists) {
//               db.collection("users")
//                 .doc(user.uid).set({
//                   picture: document.getElementById("avatar")
//                 });
//             }
    
//             db.collection("users").doc(user.uid).update({
//                 picture: document.uploaded_image

//             })
//           })
//         }
//       })
//     }

// function init() {
//     document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
//     }
    
//     function handleFileSelect(event) {
//     const reader = new FileReader()
//     reader.onload = handleFileLoad;
//     reader.readAsText(event.target.files[0])
//     }
    
//     function handleFileLoad(event) {
//     console.log(event);
//     document.getElementById('fileContent').textContent = event.target.result;
//     }
    

// function uploadImage() {
//     const onFileChange = (e) => {
//         const file = e.target.files[0]
//         const storageRef = app.storage().ref()
//         const fileRef = storageRef.child(file.name)
//         fileRef.put(file).then(() => {
//             console.log("Uploaded file", file.name)
//         })
//     }

//     const onSubmit = (e) => {
//         e.preventDefault()
//     }
// }
// var uploaded_image = ''

// const image_input = document.querySelector("#image_input");
// image_input.addEventListener("change", function() {
//    const reader = new FileReader();
//    reader.addEventListener("load", () => {
//    const uploaded_image = reader.result;
// });
//    reader.readAsDataURL(this.files[0]);
// });

// function uploadImage (){
//     const ref = firebase.storage().ref()

//     const file = document.querySelector("image_input").files[0]

//     const name = new Date() + '-' + file.name

//     const metadata = {
//         contentType:file.type
//     }

//     const task = ref.child(name).put(file)

//     task.then(snapshot => snapshot.ref.getDownloadURL()).then (url => {
//         console.log(url)
//         alert("Image Upload Successfil")
//     })
// }

// function uploadImage() {
// // Create the file metadata

// var storageRef = document.getElementById("image_input")

// var metadata = {
//     contentType: 'image/jpeg'
//   };
  
//   // Upload file and metadata to the object 'images/mountains.jpg'
//   var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
  
//   // Listen for state changes, errors, and completion of the upload.
//   uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//     (snapshot) => {
//       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log('Upload is ' + progress + '% done');
//       switch (snapshot.state) {
//         case firebase.storage.TaskState.PAUSED: // or 'paused'
//           console.log('Upload is paused');
//           break;
//         case firebase.storage.TaskState.RUNNING: // or 'running'
//           console.log('Upload is running');
//           break;
//       }
//     }, 
//     (error) => {
//       // A full list of error codes is available at
//       // https://firebase.google.com/docs/storage/web/handle-errors
//       switch (error.code) {
//         case 'storage/unauthorized':
//           // User doesn't have permission to access the object
//           break;
//         case 'storage/canceled':
//           // User canceled the upload
//           break;
  
//         // ...
  
//         case 'storage/unknown':
//           // Unknown error occurred, inspect error.serverResponse
//           break;
//       }
//     }, 
//     () => {
//       // Upload completed successfully, now we can get the download URL
//       uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//         console.log('File available at', downloadURL);
//       });
//     }
//   );
// }