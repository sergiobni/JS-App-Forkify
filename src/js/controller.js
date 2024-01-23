import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable'; //Polyfill
import 'regenerator-runtime/runtime'; //Polyfill async await

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

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

controlRecipes();

//Publisher-subscriber pattern
const init = () => {
  recipeView.addHandlerRender(controlRecipes);
};

init();
