const monthlyExpenses = document.getElementById("monthly-expense");

const btnOpenClose = document.getElementById("btn-open-close");
const btnAddExpense = document.getElementById("btn-add-expense");
const btnEditExpense = document.getElementById("btn-edit-expense");

const addExpenseContainer = document.getElementById("add-expense-container");
const editExpenseContainer = document.getElementById("edit-expense-container");

let txtAddDescription = document.getElementById("txt-add-description");
let txtAddPrice = document.getElementById("txt-add-price");
let txtEditDescription = document.getElementById("txt-edit-description");
let txtEditPrice = document.getElementById("txt-edit-price");

const expenseListContainer = document.getElementById("expense-list-container");

let expensesFromLocalStorage = JSON.parse(localStorage.getItem("expenses"));

let expenses = expensesFromLocalStorage || [];

let expense;

let start = 0,
page = 1, 
pagesCount = 0;
let startWith = 0;
let endWith = 12;
let backPages = [];
const rowCount = 4;

function* getId()
{
    let idSet = new Set([...expenses.map(e => e.id)]);
    let id = 1;
    while(true)
    {
        if(idSet.has(++id))
            continue;

        yield id;
    }
}



showExpenses();

const months = {
    0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
}

// let date = new Date();
//     // console.log(date)
//     let monthIndex = date.getMonth();
//     date = `${months[monthIndex]} ${date.getDate()} ${date.getFullYear()}`;

// for (let index = 0; index < 200; index++) {
//     expenses.push(
//         {
//             id: idGenerator.next().value,
//             description: `Product ${index+1}`,
//             price: 10 + index,
//             date 
//         }
//     )
    
// }
// showExpenses();


btnOpenClose.onclick = () => {
    if(editExpenseContainer.classList.contains("move-up"))
    {
        editExpenseContainer.classList.toggle("move-up")
    }
    else
    {
        addExpenseContainer.classList.toggle("move-up");
    }
    changeSymbol();
}

// addExpenseContainer.addEventListener("click", (e) => {
   
//     if(e.target.tagName === "INPUT")
//     {
//         e.target.removeAttribute("title");
//         e.target.style.border = "0";
//     }
// })

// function removeErrorFromInputs(inputs)
// {
//     inputs.forEach(input => {
//         input.onfocus = () => {
//             input.removeAttribute("title");
//             input.style.border = "0";
//         }
//     });
// }

function changeSymbol()
{
    if(btnOpenClose.textContent === "+")
    {
        btnOpenClose.textContent = "x";
        btnOpenClose.style.backgroundColor = "#fff";
        btnOpenClose.style.color = "rgb(71, 136, 65)";
    }
    else
    {
        btnOpenClose.textContent = "+";
        btnOpenClose.style.backgroundColor = "rgb(71, 136, 65)";
        btnOpenClose.style.color = "#fff";
    }
}

btnAddExpense.onclick = addExpense;
btnEditExpense.onclick = editExpense;

function validate(description, price, txtDescription, txtPrice)
{
    const descriptionPattern = /^[\w\s]{3,30}$/i;
    const pricePattern = /^\d+(\.\d{2})?$/;
    let isOk = true;

    if(!descriptionPattern.test(description))
    {
        txtDescription.style.border = "2px solid rgb(255,0,0)";
        txtDescription.setAttribute("title", "The length of the description should be between 3 and 30. It's allowed letters, numbers and dashes.");

        isOk = false;
    }


    if(!pricePattern.test(price))
    {
        txtPrice.style.border = "2px solid rgb(255,0,0)";
        txtPrice.setAttribute("title", "Only numbers with two places after the period are allowed.");

        isOk = false;
    }

    return isOk;
}



function addExpense()
{
   let description = txtAddDescription.value;

   let price = txtAddPrice.value;

   if(validate(description, price, txtAddDescription, txtAddPrice))
   {
    let date = new Date();
    // console.log(date)
    let monthIndex = date.getMonth();
    date = `${months[monthIndex]} ${date.getDate()} ${date.getFullYear()}`;

    price = parseFloat(price).toFixed(2);
    
   let idGenerator = getId();

    expenses.push(
        {
         id: idGenerator.next().value,
         description,
         price,
         date
        });
   
    addExpenseContainer.classList.toggle("move-up");
    txtAddDescription.value = "";
    txtAddPrice.value = "";
    changeSymbol();
    showExpenses();
    localStorage.setItem("expenses", JSON.stringify(expenses));
   }
}

function editExpense(){
    let description = txtEditDescription.value;

    let price = txtEditPrice.value;
 
    if(validate(description, price, txtEditDescription, txtEditPrice))
    {
     let date = new Date();
     // console.log(date)
     let monthIndex = date.getMonth();
     date = `${months[monthIndex]} ${date.getDate()} ${date.getFullYear()}`;
     
     price = parseFloat(price).toFixed(2);
     
     let itemIndex = expenses.indexOf(expense);
     expenses[itemIndex] = (
         { 
          id: expense.id,
          description,
          price,
          date
         });
    
     editExpenseContainer.classList.toggle("move-up");
     txtEditDescription.value = "";
     txtEditPrice.value = "";
     changeSymbol();
     showExpenses();
     localStorage.setItem("expenses", JSON.stringify(expenses));
    }
}

function deleteExpense(index)
{
    expenses.splice(index,1);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    if(page === pagesCount) page--;
    showExpenses();
}

function showExpenses()
{
    expenseListContainer.innerHTML = "";

    if(expenses.length === 0)
    {
        expenseListContainer.innerHTML = "<p>No items yet</p>";
    }
    else
    {
      
        let total = expenses.reduce((accum, item) => {
            return accum + parseFloat(item.price);
        }, 0);


        total = parseFloat(total).toFixed(2);

        monthlyExpenses.innerHTML = `$${total}`;

        // console.log(expenses)

        const auxExpenses = [...expenses].reverse();

        renderPagination(auxExpenses, page);

        start = (page - 1) * 4;
 

        let limit = start + rowCount;
        
        for (let index = start; index < limit; index++) 
        {
            const exp = auxExpenses[index];
            if(!exp) break;
            expenseListContainer.innerHTML += `<div id="${exp.id}" class="item-container">
                                                <section class="full">
                                                    <section class="half-1">
                                                        <span class="description">${exp.description}</span>
                                                        <span class="price">$${exp.price}</span>
                                                        <span class="date">${exp.date}</span>
                                                    </section>
                                                    <section class="half-2">
                                                        <button class="btn-move-right">
                                                            <
                                                        </button>
                                                        <button class="btn-edit-expense">
                                                            EDIT
                                                        </button>
                                                        <button class="btn-delete-expense">
                                                            DELETE
                                                        </button>
                                                    </section>
                                                </section>
                                               </div>`
            
        }

       
        addEvents();

    }
}

function renderPagination(auxExpenses, page)
{
    let expenseCount = auxExpenses.length;
    pagesCount = Math.ceil(expenseCount / rowCount);
    const pageContainer = document.getElementById("page-container");
    pageContainer.innerHTML = "";

    const maxPagesShown = 12;

    if(page >= endWith && pagesCount > 12 && page < pagesCount)
    {
       
        startWith = page - 1;
        backPages.push(startWith);
        backPages.push(startWith + 1);
    // console.log(backPages);
       
        // backPages.push(page - 1); 
    }
    else{
        if(backPages.includes(page))
        {
            
            startWith -= maxPagesShown - 1;

            backPages = [];
            backPages.push(startWith);
            backPages.push(startWith + 1);

            if(startWith < 0) 
                startWith = 0;
            
        }
    }
    
    endWith = startWith + maxPagesShown;

    for (let index = startWith; index < endWith; index++) 
    {
        if(index === page - 1)
            pageContainer.innerHTML += `<button id="${index+1}" class="page selected">${index + 1}</button>`;
        else
            pageContainer.innerHTML += `<button id="${index+1}" class="page">${index + 1}</button>`;

        if(index === pagesCount - 1)
            break;
        
    }
}

function addEvents()
{
    document.body.onclick = (e) => {
        let item = e.target;
        let parent = item.parentNode;
        

        if(parent.className === "half-1")
        {
            parent = item.closest(".full");
            parent.classList.toggle("move-left")
        }
        
        if(e.target.tagName === "INPUT")
        {
            e.target.removeAttribute("title");
            e.target.style.border = "0";
        }

        if(item.className === "btn-edit-expense")
        {
            editExpenseContainer.classList.toggle("move-up");

            parent = item.closest(".item-container");
            
            expense = expenses.find(exp => exp.id === parseInt(parent.id));
            
            
            changeSymbol();
            txtEditDescription.value = expense.description;
            txtEditPrice.value = expense.price;
        }

        if(item.className === "btn-delete-expense")
        {
            parent = item.closest(".item-container");
            
            expense = expenses.find(exp => exp.id === parseInt(parent.id));
            // console.log(expense)
           

            let index = expenses.indexOf(expense);

            // console.log("parent.id",parent.id, "parent",parent, "expense",expense, "index", index)

            deleteExpense(index);
            // parent.remove();
        }

        if(item.className === "btn-move-right")
        {
            parent = parent.parentNode;
            parent.classList.toggle("move-left");
        }

        if(item.className === "page")
        {
            // page = parseInt(item.getAttribute("id"));
            page = parseInt(item.id);
            showExpenses();
        }

        if(item.className === "back")
        {
            if(page > 1)
            {
                page--;
                showExpenses();
            }    
        }

        if(item.className === "forward")
        {
            if(page < pagesCount)
            {
                page++;
                showExpenses();
            }
        }
    }
}

txtAddDescription.onkeydown = (e) => {
    if(e.key === "Enter")
    {
        txtAddPrice.focus();
    }
}

txtAddPrice.onkeydown = (e) => {
    if(e.key === "Enter")
    {
        btnAddExpense.click();
        document.body.focus();
    }
}

txtEditDescription.onkeydown = (e) => {
    if(e.key === "Enter")
    {
        txtEditPrice.focus();
    }
}

txtEditPrice.onkeydown = (e) => {
    if(e.key === "Enter")
    {
        btnEditExpense.click();
        document.body.focus();
    }
}

document.body.onkeydown = (e) => {
    if(e.key === "ArrowUp")
    {
        btnOpenClose.click();
        document.body.focus();
    }

    // if(e.key === "Shift")
    // {
    //     txtAddDescription.focus();
    // }
}