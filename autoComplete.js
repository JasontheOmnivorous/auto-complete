const autoCompleteInputTag = document.getElementsByClassName("autoCompleteInput")[0]; 

/* Fetch API */
//Application programming interface (API)

//fetching data from fake store api with fetch method

//fetch has usually two parameters, first is resource address and second is an object(optional)
let products;
const resource = "https://fakestoreapi.com/products";

const fetchingFunction = async () => {
   const fetchingdata = await fetch(resource); //fetch also returns a promise
//when the resource's resolve run and the code reach .then, the resource automatically adds response object as paramter of .then's callback
   const responseData = await fetchingdata.json(); //json method also returns a promise
   products = responseData; //add the let products variable the changed JSON data
   autoCompleteInputTag.disabled = false; //removes the disabled: true once the data is finished fetching 
}

fetchingFunction().catch((error) => {
  console.log("Catched error: ", error);
});


const resultContainerTag = document.getElementsByClassName("resultContainer")[0];

/*assign the filtered products here because we need to use this inside navigateAndSelectProduct function,
 so we need to put this array in global scope */
let filteredProducts = []; 

autoCompleteInputTag.addEventListener("keyup", (event) => {
//to make the keyboard navigation, .key property returns which key the user pressed
  if ( event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter"
) {
      navigateAndSelectProduct(event.key);
      return; //return because we don't need to filter the products anymore and we just need to navigate with keys
}

   resultContainerTag.innerHTML = ""; //removes all the previous search when you do another search
   const searchText = event.target.value.toLowerCase();

/* when you search a product name and remove all the text, the website still  shows all the product in the array.
This is because when you remove all the text, the searchText will return an empty string
the empty string(space) includes in every element of the JSON array, that's why it shows all the products. */   

//to solve the empty string problem
if (searchText.length === 0) {
    return;  //don't run the filter function if the searchText.length is 0 which is empty string   
}

//assign the filtered array to a variable 
   filteredProducts = products.filter(product => {
//we should turn both the searchText and title value of the array to lower case letters to match the user's search 
   return product.title.toLowerCase().includes(searchText); //compare and check searchText to the array by using title key of the array elements
    })

//will return true if the filteredProducts array has index greater than 0(which means, there're elements in the array), if not, false
    const hasProductsToShow = filteredProducts.length > 0;

    if (hasProductsToShow) {
           for (let i = 0; i < filteredProducts.length; i++) {
           const productItemContainer = document.createElement("div");
           productItemContainer.id = filteredProducts[i].id;
           productItemContainer.classList.add("productItemContainer");

           const productName = document.createElement("div");
           productName.classList.add("productName");
           productName.append(filteredProducts[i].title);

           const productImage = document.createElement("img");
           productImage.classList.add("productImage");
           productImage.src = filteredProducts[i].image;
           
           productItemContainer.append(productName, productImage);
           resultContainerTag.append(productItemContainer);
        }
    }
})


//beginning indexToSelect is -1 because the user haven't select any of the filtered elements(index starts from 0)
let indexToSelect = -1;
const navigateAndSelectProduct = (key) => {
    if (key === "ArrowDown") {
      if (indexToSelect === filteredProducts.length - 1) {
        indexToSelect = -1;
        deselectProduct();
        return;
      }

       indexToSelect += 1;
      
/* need to call the productItemContainerToSelect back to give it the "selected" class(which is given to the classlist below), 
because the DOM element called with id is in a function now */
       const productItemContainerToSelect = selectProduct(indexToSelect);

//you need to check the previous products and deselect them       
       if (indexToSelect > 0) {
        deselectProduct();
       }

       productItemContainerToSelect.classList.add("selected"); 

    } else if (key === "ArrowUp") {

/* if the user search a product and mispress the ArrowUp key, this will lead to an error,  
this is because the indexToSelect will do the substraction once the key is pressed, therefore, -2 , there's no -2 in index so.
To solve this, we just need to check a condition, if indexToSelect is -1(which is initial state), return this and don't run the sustraction
process anymore */

      if (indexToSelect === -1) {
        return;
      } 

/* Here comes the another problem:) , when the user press the ArrowDown key and the select is now the first product.
Then the user might mispress the ArrowUp key again which leads to the value of -1, now the checking function above is passed and
the substraction process is running, this is when the indexToSelect is -2 again and the same error is raised. 
To solve this, we just need to make another check before the substraction process */

      if (indexToSelect === 0) {
/* deselects the product when the user press ArrowUp key at 0 index, 
reset it to default value and don't run the substraction by returning */
        deselectProduct(); 
        indexToSelect = -1;
        return; 
      }

       indexToSelect -= 1;
       deselectProduct();

/* we need to add the selected product the same class called inside the deselect function inorder to deselect the previous product
, the same thing we did for ArrowDown */
       const productItemContainerToSelect = selectProduct(indexToSelect);
       productItemContainerToSelect.classList.add("selected");

    } else {
      
        const enteredProduct = selectProduct(indexToSelect);
        const childNodeCheck = resultContainerTag.hasChildNodes(enteredProduct); //will return boolean
        if (childNodeCheck) {
          resultContainerTag.innerHTML = "";
          const newH1 = document.createElement("h1");
          newH1.textContent = "You Entered a product";
          resultContainerTag.append(newH1);

        }
      }
}

const selectProduct = (index) => {
  const productIdToSelect = filteredProducts[index].id.toString();
       const productItemContainerToSelect = document.getElementById(productIdToSelect);
       productItemContainerToSelect.style.backgroundColor = "#237BFF";
       productItemContainerToSelect.firstChild.style.color = "white"; //first child is the title

/* if you want to assign a variable inside a function or block scope to a variable in the global scope, 
you need to return it or write it without declarations(let, const) */    
       return productItemContainerToSelect; 
}

const deselectProduct = () => {
  const productToDeselect = document.getElementsByClassName("selected")[0];
        productToDeselect.style.backgroundColor = "white";
        productToDeselect.firstChild.style.color = "black";
        productToDeselect.classList.remove("selected");
}
