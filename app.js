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
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
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
        clearInput : function() {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
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
        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
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

    // Update item submit
    const itemUpdateSubmit = function(e) {
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
