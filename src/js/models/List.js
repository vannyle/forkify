import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        // Persist shopping list data
        this.persistShoppingData();
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
        // Persist shopping list data
        this.persistShoppingData()
    }

    deleteAllItems() {
        this.items.splice(0, this.items.length);
        this.persistShoppingData();
        return this.items;

    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

    persistShoppingData() {
        localStorage.setItem('list', JSON.stringify(this.items));
    }

    readShoppingStorage() {
        let storage = null;

        try {
            storage = JSON.parse(localStorage.getItem('list'));
        } catch(e) {
            localStorage.removeItem('list');
        }

        if (storage) {
            this.items = storage;
        }
    }
}