var db = firebase.firestore();
var text;
var date = Date();
var count=1;
var list =[];

var name =localStorage.getItem("storageName");

$(document).ready(function(){
    $("#chat").emojioneArea();

});
users();
welcome();
realTime4();



function removeUsers(){
    console.log("REMOVE");
    $("#online").html('');

}
  
function users(){
    var dbName, dbOnline;
    var first = true;
    
    db.collection("users").where("online", "!=", "")
        .onSnapshot(function(querySnapshot) {
            removeUsers();
            querySnapshot.forEach(function(doc) {
            
                    
                    dbName = doc.get("name").toString();
                    dbOnline = doc.get("online").toString();
                   
                    $("#online").append(dbName+" "+dbOnline+" <br>");
                    
           
       
        });
    });


}

function remove(dbName,dbTime,dbText){
    console.log("removed called")
    db.collection("messages").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            db.collection("messages").doc(doc.id).delete()
        });
    });

    console.log("COUNT "+count);
    count=1;
    $("#text").html('');
    $("#text").append(dbTime+": ");
    $("#text").append(dbName+": ");
    $("#text").append(dbText+" <br>"); 
  }


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
                $("#text").append(dbTime+": ");
                $("#text").append(dbName+": ");
                $("#text").append(dbText+" <br>"); 
                if(count == 10){
                     remove(dbTime, dbName, dbText);
                     console.log("REMOVE IS OUT")
9                }
                     
           }
            if (change.type === "modified") {
                console.log("Modified doc: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed doc: ", change.doc.data());
            }
        
        });
    });
}

$("#logout").click(function(){
    console.log("log out");
    db.collection("users").where("online", "!=", "")
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            dbName = doc.get("name").toString();
            dbOnline = doc.get("online").toString();
                if(name == doc.get("name")){
                        db.collection("users").doc(doc.id).update({
                            online: false
                        })
                        .then(function() {
                            console.log("Document successfully updated!");
                            window.location.href="index.html";

                        })
                        .catch(function(error) {
                            // The document probably doesn't exist.
                            console.error("Error updating document: ", error);
                        });
                    }
                    });
                });
});


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
        count++;
        console.log("COUNT "+count);
        if(count >10){
            count=1; 
            console.log("COUNT "+count);

        }



    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

});





