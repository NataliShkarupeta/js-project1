import { fetchApi } from './fetch';
import { url_ingredient_by_name } from './fetch';
import { favIngridientToLocalStorage } from './localStorage';
import closeBtnSvg from '../images/svg/icons.svg';
import obj from './localStorage';

export const INGR = 'ingridient';
const { save, load } = obj;
const cocktailModalCard = document.querySelector('.modal-cocktail');

function renderCocktailModalCard(element) {
  cocktailModalCard.insertAdjacentHTML('afterbegin', element);
}

export function createCocktailModalCard(cocktailObject) {
  console.log(cocktailObject);
  let { strDrink, strDrinkThumb, strInstructions, strGlass, strCategory } =
    cocktailObject;
  let measureArray = [];
  let ingredientArray = [];
  for (let i = 1; i < 15; i += 1) {
    if (cocktailObject.strIngredient1) {
      if (!cocktailObject[`strIngredient${i}`]) continue;
      ingredientArray.push(cocktailObject[`strIngredient${i}`]);
      measureArray.push(cocktailObject[`strMeasure${i}`]);
    } else {
      console.log(...cocktailObject.cocktailIngr);
      // if (!cocktailObject[`cocktailIngr${i}`]) continue;
      // ingredientArray.push(cocktailObject[`cocktailIngr${i}`]);
      // measureArray.push(cocktailObject[`cocktailMeasure${i}`]);
    }
  }

  const ingredientArrayMarkup = ingredientArray
    .map(item => {
      return ` <li class="modal-cocktail__item">
        <a class="modal-cocktail__link link" href="#" data-modal-ingredient-open>${item}</a>
        </li>`;
    })
    .join('');

  const cocktailModalCardMarkup = `
      <button class="modal__close-btn" type="button" data-modal-cocktail-close>
      <svg class="modal__close-svg" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <use href="${closeBtnSvg}#menu-close"></use>
      </svg>
     </button>

    <h3 class="modal-cocktail__title">${strDrink}</h3>
    <div class="modal-wraper">
      <div class="modal-cocktail__wrap-instructions">
        <h4 class="modal-cocktail__subtitle">Instructions:</h4>
        <p class="modal-cocktail__instructions">${strInstructions}</p>
      </div>
      <img
        class="modal-cocktail__image"
        src="${strDrinkThumb}"
        alt="Cocktail ${(strDrink, strGlass)} "
      />
      <div class="modal-cocktail__wrap-ingredients">
        <h4 class="modal-cocktail__ingredients">Ingredients</h4>
        <p class="modal-cocktail__per">Per cocktail</p>
        <ul class="modal-cocktail__list">${ingredientArrayMarkup}</ul>
      </div>
    </div>
    <button type="button" class="button__add-or-remove--modal">Add to favorite</button>`;
  renderCocktailModalCard(cocktailModalCardMarkup);
  
  const ingrLinks = document.querySelectorAll('[data-modal-ingredient-open]');
  const ingrLinksArr = Array.from(ingrLinks);
  ingrLinksArr.map(link => {
    link.addEventListener('click', takeIngredients);
  });
}
function renderCocktailModalCard(element) {
  cocktailModalCard.insertAdjacentHTML('afterbegin', element);
}

const refs = {
  openModalIngred: document.querySelector('[data-modal-ingredient-open]'),
  closeModalIngred: document.querySelector('.modal-ingredient__backdrop'),
  modalIngred: document.querySelector('[data-modal-ingredient]'),
};

function takeIngredients(event) {
  const ingr = event.target.textContent;

  refs.closeModalIngred.classList.remove('is-hidden2');
  fetchApi(url_ingredient_by_name, ingr)
    .then(obj => {
      сreateIngredientModalCard(obj.ingredients[0]);
      console.log(obj);
      save(INGR, obj.ingredients[0]);
    })
    .catch(err => {
      console.log(err);
    });
}

function сreateIngredientModalCard(obj) {
  if (document.querySelector('.ingridient-wrapper')) {
    document.querySelector('.ingridient-wrapper').innerHTML = '';
  }
  const ingredientModalCardMarkup = `
 <div class="ingridient-wrapper">
  <h3 class="modal-ingredient__title">${obj.strIngredient}</h3>
    <h4 class="modal-ingredient__subtitle">${obj.strType === 'drink'}</h4>
    <hr class="modal-ingredient__line" />
    <p class="modal-ingredient__description">
      <span class="modal-ingredient__name-span">${
        obj.strIngredient
      }</span> ${(obj.strDescription = 'drink')}
    </p>
    <ul class="modal-ingredient__list list">
      <li class="modal-ingredient__item">Type: ${(obj.strType = 'Alcohol')}</li>
      <li class="modal-ingredient__item">Alcohol by volume: ${(obj.strABV =
        0 / 5)}%</li>
      <li class="modal-ingredient__item">Flavour: fantastic </li>

    </ul>
    <div class="modal-ingredient__button">
      <button type="button" class="button__add-or-remove--modal-ingr">
        Add to favorite
      </button>
 </div>
`;
  renderIngredientModalCard(ingredientModalCardMarkup);
  const butAddFavoriteIngr = document.querySelector(
    '.button__add-or-remove--modal-ingr'
  );
  butAddFavoriteIngr.style.boxShadow =
    '0 1px 1px #0000001f, 0 4px 4px #0000000f, 1px 4px 6px #00000029';
  butAddFavoriteIngr.addEventListener(
    'click',
    favIngridientToLocalStorage(INGR, obj)
  );

  refs.closeModalIngred.addEventListener('click', () =>
    refs.closeModalIngred.classList.add('is-hidden2')
  );
  
}

function renderIngredientModalCard(string) {
  const ingredientModal = document.querySelector('.modal-ingredient');
  ingredientModal.insertAdjacentHTML('afterbegin', string);
}
