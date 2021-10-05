(function () {
  function Card(cardData, deleteTimeout) {
    const {
      proudctName,
      descripe,
      firstName,
      lastName,
      collectArea,
      phonnmbr,
      images,
      key,
      price,
    } = cardData;
    const [firstImage = "https://picsum.photos/200"] = images || [];

    var hostElement = document.createElement("div");
    hostElement.setAttribute("class", "card");
    hostElement.setAttribute("data-key", key);

    var imgElememt = document.createElement("img");
    imgElememt.setAttribute("id", "prdcimg");
    imgElememt.setAttribute("alt", "your image");
    imgElememt.src = firstImage;

    var nameElement = document.createElement("h2");
    nameElement.setAttribute("id", "Nameofprdc");
    nameElement.setAttribute("class", "cardTitle");
    nameElement.innerText = proudctName;

    var firstNameElement = document.createElement("h6");
    firstNameElement.setAttribute("id", "firstName");
    firstNameElement.innerText = "Name: " + firstName;

    var priceElement = document.createElement("h6");
    priceElement.setAttribute("id", "price");
    priceElement.innerText = "Price : " + price;

    var lastNameElement = document.createElement("h6");
    lastNameElement.setAttribute("id", "lastName");
    lastNameElement.innerText = "Lastname: " + lastName;

    var areaElement = document.createElement("h6");
    areaElement.setAttribute("id", "area");
    areaElement.innerText = "Collect Destination: " + collectArea;

    var nbrElement = document.createElement("h6");
    nbrElement.setAttribute("id", "nbr");
    nbrElement.innerText = "Number: " + phonnmbr;

    var descriptionElement = document.createElement("p");
    descriptionElement.setAttribute("id", "description");
    descriptionElement.innerText = descripe;

    function resetform(){
      //not relevant for now
      var buyerName=document.getElementById("buyerName").value="";
      var buyerLastName=document.getElementById("Blname").value="";
      var buyerphn=document.getElementById("phNmbr").value="";
      var buyerCollectArea=document.getElementById("buyerCollectArea").value="";

    }
    

    function buyerDb(){
      var database= firebase.database();// først setter vi oss inn i databasen
      alert("Thank you for buying this product");
      var buyerName=document.getElementById("buyerName").value;
      var buyerLastName=document.getElementById("Blname").value;
      var buyerphn=document.getElementById("phNmbr").value;
      var buyerCollectArea=document.getElementById("buyerCollectArea").value;

      var ref = database.ref().child('Sold').push().child("productname")//så lager vi en referanse i databasen
      ref.push("Price: " + price);
      ref.push("ProductName: " + proudctName);
      ref.push("BuyerName: " + buyerName);
      ref.push("buyerLastName: " + buyerLastName);
      ref.push("BuyerPhone: " + buyerphn);
      ref.push("BuyerCollectArea: " + buyerCollectArea);     
      document.getElementById("overlay").style.display = "none"; 
      
    }


    //buyer database 
    function buyerDatabase(){
      var buybtn=document.getElementById("buy");
      var cancelBtn=document.getElementById("cancel");
      document.getElementById("overlay").style.display = "block";

      cancelBtn.addEventListener("click",function(){
        document.getElementById("overlay").style.display = "none";
        alert(buyerName);
      });

      buybtn.addEventListener("click",function(){
        buyerDb();

        return false;

      });

      var Amountbuyclickd=0;
      var buyclick=firebase.database().ref("AmountbuyClick").child("Buy clicks");
      buyclick.transaction(function(Amountbuyclickd){
        return Amountbuyclickd + 1;
      });

    }
    //until here

    function selfDestroy() {
      const deleteEvent = new Event("card-remove", { bubbles: true });
      hostElement.dispatchEvent(deleteEvent);
      hostElement.parentElement.removeChild(hostElement);
    }

    //buyer database button
    var buyButtonElement=document.createElement("button");
    buyButtonElement.setAttribute("id", "buyButton");
    buyButtonElement.addEventListener("click",buyerDatabase);
    buyButtonElement.innerText="Buy";

    //Delete button
    var deleteButtonElement = document.createElement("button");
    deleteButtonElement.setAttribute("id", "deleteButton");
    deleteButtonElement.addEventListener("click", selfDestroy);
    deleteButtonElement.innerText = "x";

    hostElement.appendChild(buyButtonElement);
    hostElement.appendChild(deleteButtonElement);
    hostElement.appendChild(imgElememt);
    hostElement.appendChild(priceElement);
    hostElement.appendChild(nameElement);
    hostElement.appendChild(firstNameElement);
    hostElement.appendChild(lastNameElement);
    hostElement.appendChild(areaElement);
    hostElement.appendChild(nbrElement);
    hostElement.appendChild(descriptionElement);

    if (deleteTimeout && deleteTimeout > 0) {
      setTimeout(selfDestroy, deleteTimeout);
    }

    return hostElement;
  }

  window.Card = Card;
})();
