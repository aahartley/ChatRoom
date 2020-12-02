var db = firebase.firestore();
var text;
var date = Date();
var count=0;
var list =[];
var emojis=[{key:":smile:",value:"0x1F600" },
            {key:":dog:",value:"0x1F436"},
            {key:":heart:",value:"0x1F497"},
            {key:":heartbreak:",value:"0x1F494"},
            {key:":dog:",value:"0x1F436"}];

var name =localStorage.getItem("storageName");

$(document).ready(function(){
  //  $("#chat").emojioneArea();

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
    
    db.collection("users").where("name", "!=", "").orderBy("name","asc")
        .onSnapshot(function(querySnapshot) {
            removeUsers();
            querySnapshot.forEach(function(doc) {
            
                    
                    dbName = doc.get("name").toString();
                    dbOnline = doc.get("online").toString();
                   // $("#online").append(dbName+" "+dbOnline+" <br>");
                   if(dbOnline =="true"){
                    $("#online").append($('<span>').css('color', 'green').text(dbName))
                    .append($('<br>'));
                   }
                   else{

                    $("#online").append($('<span>').css('color', 'red').text(dbName))
                    .append($('<br>'));}
       
        });
    });


}

function remove(dbTime,dbName,dbText){
    console.log("removed called")
    db.collection("messages").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            db.collection("messages").doc(doc.id).delete()
        });
    });

    console.log("COUNT IN REMOVE "+count);
    count=0;
    $("#text").html('');
    $("#text").append(dbTime+": ");
    $("#text").append(dbName+": ");
    $("#text").append(dbText+" <br>"); 
  }


function welcome(){
    db.collection("messages").doc("Admin").set({
        text: "WELCOME,"+name+" Remember to logout, messages erase after 10",
        user: "Admin",
        time: date
    })
    .then(function() {
        console.log("Document successfully written!");
      //  $(".emojionearea-editor").html('');
      count=1;
      writeCount();


    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}

function writeCount(){
    console.log("COUNT IS: ",count);
db.collection("count").doc("count").set({
    count: count
})
.then(function() {
    console.log("Document successfully written!",count);
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});
}

function readCount(){
    db.collection("count").doc("count")
    .onSnapshot(function(doc) {
        console.log("Current data (READCOUNT): ", doc.data());
        count = doc.get("count");
    });
}

function realTime4(){
    var dbText,dbName;

    db.collection("messages").where("time", "!=", "").orderBy("time","asc")
    .onSnapshot(function(snapshot) {
        
        snapshot.docChanges().forEach(function(change) {
        
            if (change.type === "added") {
                count++;
                writeCount();
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
                readCount();
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

$("#logout").click(logout);
function logout(){
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
            }


$("#enter").click(clickE);

function clickE(){
     text = $("#chat").val();
     for(var i=0; i<emojis.length;i++){
        if(text == emojis[i].key){
            text =String.fromCodePoint(emojis[i].value);
        }
     }
    console.log(date);
     date = Date();

    db.collection("messages").add({
        text: text,
        user: name,
        time: date
    })
    .then(function() {
        console.log("Document successfully written!");
       // $(".emojionearea-editor").html('');
       $(".chat").html("<input id ='chat' type='text'></input> <input id='enter' type='button' value = 'submit' onclick='clickE()'></input><input id='logout' type='button' onclick='logout()' value = 'logout'></input>");
       $("#chat").focus();
        console.log("COUNT "+count);
        if(count >10){
            count=0; 
            console.log("COUNT "+count);

        }



    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

}
$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
       clickE();
    }
});





