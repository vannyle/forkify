import {elements} from "./base";

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid=${id}]`);
    if (item) item.parentElement.removeChild(item);
}

export const renderDeleteBtn = () => {
    const markup = `
        <button type="button" class="btn btn-delete-all">
            <svg focusable="false" data-prefix="far" data-icon="trash-alt"
                class="svg-inline--fa fa-trash-alt fa-w-14" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512">
                <path fill="#ffffff"
                    d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path>
            </svg>
            Delete all items
        </button>
    `
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteAllItems = () => {
    const items = document.querySelectorAll('.shopping__item');
    items.forEach(el => {
        el.remove();
    });
    const deleteBtn = document.querySelector('.btn-delete-all');
    deleteBtn.remove();
}