import Search from './models/Search';
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from "./views/base";

import '../css/style.css';
/*
Global state of the app:
* Search object;
* Current recipe object;
* Shopping list object;
* Liked recipes
 */

// SEARCH CONTROLLER
const state = {};
window.state = state;

const controlSearch = async () => {
    // 1. Get query from the view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);
        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        try {
            // 4. Search for recipes
            await state.search.getResults();
            clearLoader();
            // 5. Render results on UI
            searchView.renderResults(state.search.results);
            // console.log(state.search.results);
        } catch (error) {
            console.log(`Something went wrong with searching`);
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.results, goToPage);
    }
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);
        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcServing();
            state.recipe.calcTime();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            alert(`Error processing recipe!`)
        }
    }
}

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

// LIST CONTROLLER

const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })

    listView.renderDeleteBtn();
}

// Handle delete and update list items

elements.shopping.addEventListener('click', e => {
    if (e.target.matches('.btn-delete-all')) {
        state.list.deleteAllItems();
        listView.deleteAllItems();
    }

    let id;
    const closestItem = e.target.closest('.shopping__item');
    if (closestItem) {
        id = closestItem.dataset.itemid
    }
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from the state
        state.list.deleteItem(id);
        console.log(state.list);
        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

// LIKES CONTROLLER

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // User has NOT liked current recipe yet
    if (!state.likes.isLiked(currentID)) {
        // Add like to the data
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add to the UI list
        likesView.renderLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the data
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove from the UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.list = new List();

    //Restore likes and shopping list
    state.likes.readStorage();
    state.list.readShoppingStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());


    // Render the exist likes and shopping list
    state.likes.likes.forEach(like => likesView.renderLike(like));

    state.list.items.forEach(item => listView.renderItem(item));
    if (state.list.items.length > 0) {
        listView.renderDeleteBtn();
    }

})

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.serving > 1) {
            state.recipe.updateServing('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServing('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();

    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
})

window.l = new List();


