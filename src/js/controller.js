import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable'; //Polyfill
import 'regenerator-runtime/runtime'; //Polyfill async await

//Parcel hot module
if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    //Guard clause
    if (!id) return;
    //Loading spinner
    recipeView.renderSpinner();
    //1 Loading recipe
    await model.loadRecipe(id); //Async function, returns promise, we need to await it
    //2 Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);
    // 1 Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2 Load search result
    await model.loadSearchResult(query);

    // 3 Render results
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

//Publisher-subscriber pattern
const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSeach(controlSearchResults);
};

init();
