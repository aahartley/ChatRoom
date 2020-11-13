
var db = firebase.firestore();
var sName;
var names =[];
var pass =[];

var input;

realTime4();
function realTime4(){
    var dbName;

    db.collection("users").where("name", "!=", "")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                dbName = change.doc.get("name").toString();
                console.log("Test"+dbName);
                names.push(change.doc.data().name);
             //   dbPass = change.doc.get("pass").toString();
                pass.push(change.doc.data().pass);
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });
}





db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});


$("#login").click(function(){
    input = $("#fname").val();
    input2 = $("#lname").val();
    console.log("name is"+input);
    console.log("name is"+input2);
    for(var i=0; i<names.length;i++){
    if(input == names[i] && input2 == pass[i]){
        sName = names[i];
        localStorage.setItem("storageName",sName);

        window.location.href="room.html";
    }
        else
        console.log("wrong ");
}
});

$("#signup").click(function(){
    var taken;
    console.log("SIGNUP");
    input = $("#fname").val();
    input2 = $("#lname").val();
    console.log(input2);
    for(var i=0; i<names.length;i++){
        if(input == names[i]){
            taken = true;
            break;
        }
           
    }
    if(taken){
        console.log("taken");
    }
    else{
        db.collection("users").add({
            name: input,
            pass: input2,
            status: "user"
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

});

