import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
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
    //1 Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //2 Update bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //3 Loading recipe
    await model.loadRecipe(id); //Async function, returns promise, we need to await it
    //4 Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
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

const controlServings = newServings => {
  //Update recipe servings (in state)
  model.updateServings(newServings);

  //Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  //1 Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recipe view
  recipeView.update(model.state.recipe);

  //3 Rener bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    //Render spinner before upload the data
    addRecipeView.renderSpinner();
    //Upload the recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close form windows
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.log(`🛩️${err}🛩️`);
    addRecipeView.renderError(err.message);
  }
};

//Publisher-subscriber pattern
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSeach(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
