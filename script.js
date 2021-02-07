
const doFetchRequest = (url, generateCard) => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.meals === null) {
                showErrorMessage('Sorry!', 'Your searched food is not available at this Moment')
                return;
            }
            const meals = data.meals;
            if (generateCard) {
                meals.forEach(meal => {
                    makeCard(meal.strMeal, meal.strMealThumb, meal.idMeal);
                });
            }
            else {

                const ingredientsList = document.getElementById("ingredients");
                deleteChildren(ingredientsList);
                handleIngredient(data.meals[0], ingredientsList);
            }
        })
        .catch(err => {
            console.error(err);
        });
}


const handleSearch=(searchInput)=>{
    document.getElementById("mealDetails").style.display = "none" ;
    if(searchInput == "" || searchInput == " " || searchInput == undefined){
        showErrorMessage('Search field cannot be empty', 'Please write your Favorite Food Name')
        return;
    }
    deleteChildren(document.getElementById("mealResult"));
    doFetchRequest(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`, true);

}

const makeCard = (name, imgSrc, mealID) =>{
    const mealContainer = document.getElementById("mealResult");

    const mealCard = document.createElement('div');
    mealCard.className="col";

    const card = document.createElement('div');
    card.className = "card";
    card.id ="meal";

    const cardTitle = document.createElement('h5');
    cardTitle.className = "card-title";
    cardTitle.id = "meal-name";
    cardTitle.innerText = name;
    cardTitle.style.textAlign = 'center';

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const img = document.createElement('img');
    img.className = "card-img-top";
    img.setAttribute('src', imgSrc);    

    mealContainer.appendChild(mealCard);
    mealCard.appendChild(card);
    card.appendChild(img);
    cardBody.appendChild(cardTitle);
    card.appendChild(cardBody);
   
mealCard.addEventListener('click', function(){
        document.documentElement.scrollTop = 0;
        document.getElementById("mealDetails").style.display = "block" ;
        document.getElementById("meal-title").innerText = name;
        document.getElementById("meal-img").setAttribute("src", imgSrc) ;
        doFetchRequest(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);            
      })
}

const handleIngredient=(meal, ingredientsList) =>{
    let ingredients = [];
    let measure = [];

    for (let i = 0; i < 20; i++) {
        const ingredientElement = "strIngredient" + (i+1);
        const measureElement = "strMeasure" + (i+1);
        if(meal[ingredientElement]){
             ingredients.push(meal[ingredientElement]);
             measure.push(meal[measureElement])
        }
    }
    ingredients.forEach(ingredient => {  
        const ingredientItem = document.createElement('p');
        ingredientItem.innerText = `${ingredient} ${measure[ingredients.indexOf(ingredient)]}`;
        ingredientsList.appendChild(ingredientItem);
    }); 
}

const deleteChildren =(container) =>{
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

const showErrorMessage = (title,text) =>{

    swal({
        title: title,
        text: text,
        icon: "warning",
        button: "Close",
      });
      
}
