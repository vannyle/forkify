import Search from './models/Search';
import Recipe from "./models/Recipe";
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from "./views/base";
/*
Global state of the app:
* Search object;
* Current recipe object;
* Shopping list object;
* Liked recipes
 */

// SEARCH CONTROLLER
const state = {};

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

    if(id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);
        try {
            // Get recipe data
            await state.recipe.getRecipe();

            // Calculate servings and time
            state.recipe.calcServing();
            state.recipe.calcTime();
            // Render recipe
            console.log(state.recipe);
        } catch (error) {
            alert(`Error processing recipe!`)
        }
    }
}

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

