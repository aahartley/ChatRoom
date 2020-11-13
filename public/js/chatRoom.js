var db = firebase.firestore();
var text;
var date = Date();
var count=0;
var list =[];
console.log(date);
var name =localStorage.getItem("storageName");
$(document).ready(function(){
    $("#chat").emojioneArea();

});
welcome();
realTime4();


function welcome(){
    db.collection("messages").doc("Admin").set({
        text: "WELCOME",
        user: "Admin",
        time: date
    })
    .then(function() {
        console.log("Document successfully written!");
        $(".emojionearea-editor").html('');


    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}



function realTime4(){
    var dbText,dbName;

    db.collection("messages").where("time", "!=", "").orderBy("time","asc")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                dbText = change.doc.get("text").toString();
                dbName = change.doc.get("user").toString();
                dbTime = change.doc.get("time").toString();
                console.log("Test"+dbText);
                console.log("time"+dbTime);
                var message ={text: dbText,user: dbName, time: dbTime};
                list.push(message);
                $("p").append(dbTime+": ");
                $("p").append(dbName+": ");
                $("p").append(dbText+" <br>"); 
                     
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

function realTime3(){
    var dbText,dbName,dbTime;

    db.collection("messages").where("text", "!=", "")
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            dbText = doc.get("text").toString();
            dbName = doc.get("user").toString();
            dbTime = doc.get("time").toString();
            console.log("Test"+dbName);
            console.log("time"+dbTime);
            $("p").append(dbTime+": ");
            $("p").append(dbName+": ");
            $("p").append(dbText+" <br>");
       
        });

    });
}


$("#login").click(function(){
     text = $("#chat").val();
    console.log(date);
     date = Date();

    db.collection("messages").add({
        text: text,
        user: name,
        time: date
    })
    .then(function() {
        console.log("Document successfully written!");
        $(".emojionearea-editor").html('');


    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

});





