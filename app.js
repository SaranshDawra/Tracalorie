// Storage Controller

// Item Controller
const ItemCtrl = (function() {
    // Item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [
            // {id: 0, name: 'Pizza', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 500}
        ],
        currentItem: null,
        totalCalories: 0
    }
    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Calories to Number
            calories = parseInt(calories);
            // Create new Item
            newItem = new Item(ID, name, calories);
            // Add to items array
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            // Loop through items
            data.items.forEach( item => {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updatedItem: function(name, calories){
            // Calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(item => {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;

                }
            });
            return found;
        },
        deleteItem: function(id){
            // Get ids
            const ids = data.items.map( item => {
                return item.id;
            });
            // Get index
            const index = ids.indexOf(id);
            // Remove item
            data.items.splice(index,1);
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            // Loop through items and add calls
            data.items.forEach(item => {
                total+= item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }

})();


// UI Controller
const UICtrl = (function() {
    const UISelector = {
        itemList : '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    // Public methods
    return{
        populateItemList : function(items) {
            let html = '';

            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-pencil edit-item"></i>
                    </a>
                </li>`;
            });
            // Insert list items
            document.querySelector(UISelector.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelector.itemNameInput).value,
                calories: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            document.querySelector(UISelector.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            // Add html
            li.innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="fa fa-pencil edit-item"></i>
            </a>`;
            // Insert item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelector.listItems);
            //turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(listItem =>{
                const itemId = listItem.getAttribute('id');
                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-pencil edit-item"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearAllItems: function(){
            data.items = [];
        },
        clearInput : function() {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelector.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        };
        hideList: function() {
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelector;
        }
    }

})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
    
    // Load Event Listners
    const loadEventListners = function() {
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        //Back btn event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        // Clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // Get form inpt from UICtrl
        const input = UICtrl.getItemInput();
        // Check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to ui
            UICtrl.showTotalCalories(totalCalories);
            // Clear fields
            UICtrl.clearInput()
        }
        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')){
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            // break into an arry
            const listIdArray = listId.split('-');
            // Get the actual id
            const id = parseInt(listIdArray[1]);
            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // Item update submit
    const itemUpdateSubmit = function(e) {
        // get item input
        const input = UICtrl.getItemInput();
        // Updated item
        const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);
        // Update ui
        UICtrl.updateListItem(updatedItem);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to ui
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        // Delete from ui
        UICtrl.deleteListItem(currentItem.id);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to ui
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const clearAllItemsClick = function(e){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to ui
        UICtrl.showTotalCalories(totalCalories);
        // Remove form ui
        UICtrl.removeItems();
        // hide the ul
        UICtrl.hideList();
        e.preventDefault();
    }

    // Public methods
    return {
        init: function() {
            // Clear Edit state
            UICtrl.clearEditState();
            // Fetch Items from data structure
            const items = ItemCtrl.getItems();
            //Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to ui
            UICtrl.showTotalCalories(totalCalories);
            // Load event listners
            loadEventListners();
        }
    }

})(ItemCtrl, UICtrl);

App.init();
