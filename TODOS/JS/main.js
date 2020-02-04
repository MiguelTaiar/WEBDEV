// Book Item
class Item {
    constructor(memory, deadline) {
      this.memory = memory;
      this.deadline = deadline;
    }
  }
  
// UI Class
class UI {
    static displayItens() {
      const itens = Store.getItens();
  
      itens.forEach((item) => UI.addItemToList(item));
    }

    static searchItem() {
      //Get value of input
      let filterValue = document.querySelector('#search').value.toUpperCase();

      //Get itens
      let li = document.querySelectorAll('#listItens');


      //Loop through li#listItens
      li.forEach((item) => UI.filter(item, filterValue));
    }

    static filter(item, filterValue) {
      let activity = item.childNodes[1];
      if(activity.innerHTML.toUpperCase().indexOf(filterValue) > -1){
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    }
  
    static addItemToList(item) {
      const list = document.querySelector('#itens-holder');
  
      const row = document.createElement('li');
      row.setAttribute("id", "listItens");
  
      row.innerHTML = `
        <span class="item-content">${item.memory}</span>
        <span class="deadline">${item.deadline}</span>
        <i class="fas fa-trash" id="trash"></i>
      `;
  
      list.appendChild(row);
    }

    static deleteItem(element) {
      if(element.classList.contains('fa-trash')) {
        element.parentElement.remove();
      }
    }

    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#add-form');
      container.insertBefore(div, form);
      //Vanish after 3 sec
      setTimeout(() => document.querySelector(`.alert-${className}`).remove(), 2000);
    }

    static clearFields() {
      document.querySelector('#activity').value = '';
      document.querySelector('#deadline').value = '';
    }
}
  
// Store Class
class Store {
  static getItens() {
    let itens;
    if(localStorage.getItem('itens') === null) {
      itens = [];
    } else {
      itens = JSON.parse(localStorage.getItem('itens'));
    }

    return itens;
  }

  static addItem(item) {
    const itens = Store.getItens();
    itens.push(item);
    localStorage.setItem('itens', JSON.stringify(itens));
  }

  static removeItem(memory, deadline) {
    const itens = Store.getItens();
    itens.forEach((item, index) => {
      if(item.memory === memory && item.deadline === deadline) {
        itens.splice(index, 1);
      }
    });

    localStorage.setItem('itens', JSON.stringify(itens));
  }
}

// Event Display Item
document.addEventListener('DOMContentLoaded', UI.displayItens);

//Event Filter Item
document.querySelector('#search').addEventListener('keyup', (e) => {
  UI.searchItem();
});

// Event Add Item
document.querySelector('#add-form').addEventListener('submit', (e) => {
  //Prevent default
  e.preventDefault();
  // Get form values
  const activity = document.querySelector('#activity').value;
  const deadline = document.querySelector('#deadline').value;

  //Validate
  if(activity === '' || deadline === '') {
    UI.showAlert('Favor preencher todos os campos', 'danger');
  } else {

    //Instantiate book
    const item = new Item(activity, deadline);
    
    //Add Item to UI
    UI.addItemToList(item);

    //Add Item to Store
    Store.addItem(item);

    //Show success message
    UI.showAlert('Item adicionado', 'success');

    //Clear fields
    UI.clearFields();
  }
});

// Event Remove a Item
document.querySelector('#itens-holder').addEventListener('click', (e) => {
  //Remove item from UI
  UI.deleteItem(e.target);

  //Remove from Store
  const memory = (e.target.parentElement.childNodes[1].innerHTML);
  const deadline = (e.target.previousElementSibling.innerHTML);
  Store.removeItem(memory, deadline);

  //Show delete messagem
  if(e.target.classList.contains('fa-trash')) {
    UI.showAlert('Item removido', 'success');
  }
});