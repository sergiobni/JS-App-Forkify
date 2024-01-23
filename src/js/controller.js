import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
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
    resultsView.render(model.getSearchResultsPage());
    // 4 Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = goToPage => {
  // 1 Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2 Render NEW pagination button
  paginationView.render(model.state.search);
};

//Publisher-subscriber pattern
const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSeach(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
