/**
 * TODO
 * 1- Create the logic behind gathering the data (JS) v
 * 2- Store that Data somewhere (JS) v
 * 3- Display the data in the DOM (JS/CSS) v
 *  3-1- Creating the card element (JS/CSS/HTML) v
 *  3-2- Creating the cards wrapper (HTML/CSS) v
 *  3-3- Appending cards every time data changes v
 * 4- Display Image v
 * 5- Re-arrange elements v
 * 6- Store products images on firebase storage v
 *   6-1- check images size x
 *   6-2- multiple images per product v
 *   6-3- fetch images by url v
 * 7- reverse products order v
 * 8- filter products by category v
 * 9- Make image larger onclick
 * 10-prevent empty field v
 * 11-fix search after when you search to make it say theres no result
 * 13- create a button that will reset filters v
 * fjerne refresh greia etter kjøpt produkt
 *  => git clone <repo_url>
 *  => git push [branch_name]
 *  => git pull
 *  * 12-Slide through pictures
 */

var cardsData = [];
var cardImg = null;
const DEFAULT_DELETE_TIMEOUT = 0;

(function () {
  var addButton = document.getElementById("btnadd");
  var cardsArea = document.getElementById("cardarticle");

  function gatherData() {
    var price = document.getElementById("price").value;
    var proudctName = document.getElementById("productName").value;
    var descripe = document.getElementById("txtarea").value;
    var firstName = document.getElementById("fname").value;
    var lastName = document.getElementById("lname").value;
    var collectArea = document.getElementById("collctid").value;
    var phonnmbr = document.getElementById("phnmbr").value;
    var category = document.getElementById("category").value;
    var images = document.getElementById("productImage").files;

    return {
      proudctName,
      descripe,
      firstName,
      lastName,
      collectArea,
      phonnmbr,
      images: images,
      price,
      date: new Date().getTime(),
      category,
      
    };
  }

  async function storeData(cardData) {
    if (!cardData) return;

    const productData = await createProduct(cardData);
    cardsData.push(productData);
  }

  function renderCards() {
    var cardsWrapper = document.getElementById("cardarticle");
    cardsWrapper.innerHTML = "";

    for (var card of cardsData) {
      var cardElement = Card(card, DEFAULT_DELETE_TIMEOUT);

      cardsWrapper.appendChild(cardElement);
    }
  }

  //Search and hide unrevelent cards

  function searchCards(){
    
    var input,filter,cards,cardContainer,title, i;
    document.getElementById("nosrchresult").style.display="none";
    input = document.getElementById("srchbar");
    filter=input.value.toUpperCase();
    cardContainer =document.getElementById("cardarticle");
    cards=cardContainer.getElementsByClassName("card");
    for (i=0; i < cards.length; i++) {
      title=cards[i].querySelector(".cardTitle");
      if (title.innerText.toUpperCase().indexOf(filter) > -1){
        cards[i].style.display= "";
      }else{
        cards[i].style.display="none"
        document.getElementById("nosrchresult").style.display="block";
      }
    }
  };

  function searchByTitle(){
    var searchbtn=document.getElementById("srchBtnn");
    searchbtn.addEventListener("click",function(){
      searchCards();
      document.getElementById('Itemsale').scrollIntoView();

      
    });
  };

  //resetsearch
  function undoSearch(){
    document.getElementById("srchbar").value;
    document.getElementById("resetbtn").addEventListener("click",function(){
      document.getElementById("srchbar").value="";
      renderCards();
      document.getElementById('Itemsale').scrollIntoView();
    });
  };

  undoSearch();
  
  searchCards();
  searchByTitle();
  
  
  //RenderCardByCatagory
  
  async function renderCardsByCategory(category) {
    cardsData = await fetchProducts(category);

    renderCards();
  }

  function resetforrm() {
    prdcNme =document.getElementById("productName").value = "";
    document.getElementById("txtarea").value = "";
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("price").value = "";
    document.getElementById("phnmbr").value = "";

  }



  async function handleAddButtonClick() {
    prdcNme =document.getElementById("productName").value;
    frstname=document.getElementById("fname").value
    lstnm=document.getElementById("lname").value
    pris=document.getElementById("price").value
    nbmr=document.getElementById("phnmbr").value
    
//prevent empty fields
    if(prdcNme.length == 0 ) { 
      document.getElementById("productName").style.border = "thin solid #ff0101";
  } 
  if (frstname.length == 0){
    document.getElementById("fname").style.border="thin solid #ff0101";
  }

  if (lstnm.length == 0){
    document.getElementById("lname").style.border="thin solid #ff0101";
  }
  
  if (pris.length == 0){
    document.getElementById("price").style.border="thin solid #ff0101";
  }

  if (nbmr.length == 0){
    document.getElementById("phnmbr").style.border="thin solid #ff0101";
    return false;
  }

  //if field not empty

  else {
    var newCard = gatherData();
    await storeData(newCard);
    renderCards(); 000000


    document.getElementById("productName").style.border = "thin solid #000000";
    document.getElementById("fname").style.border="thin solid #000000";
    document.getElementById("lname").style.border="thin solid #000000";
    document.getElementById("price").style.border="thin solid #000000";
    document.getElementById("phnmbr").style.border="thin solid #000000";
  }
   
    resetforrm();
  }

  async function handleCategoryChange(event) {
    const category = event.target.getAttribute("data-category");

    await renderCardsByCategory(category);
  }

  async function start() {
    cardsData = await fetchProducts();

    renderCards();
  }

  async function handleCardRemoval(event) {
    const key = event.target.getAttribute("data-key");

    await removeProductByKey(key);
  }

  const categoryButtons = document.querySelectorAll("button.CatogoriButtn[data-category]");
  Array.from(categoryButtons).forEach((button) => {
    button.addEventListener("click", handleCategoryChange, false);
  });

  cardsArea.addEventListener("card-remove", handleCardRemoval);
  window.addEventListener("load", start);
  addButton.addEventListener("click", handleAddButtonClick);
})();
