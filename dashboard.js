// console.log("hello")
//   document.addEventListener('DOMContentLoaded', () => {
//     initDashboard();
//   });

// // async function initDashboard() {
// //     try {
// //         const response = await fetch('expenses.json');
// //         if (!response.ok) {
// //             throw new Error(`HTTP error! status: ${response.status}`);
// //         }
        
// //         const data = await response.json();
// //         console.log(data);
        
// //         // Render Summary Header (Optional)
// //         // renderSummary(data.user, data.summary);
        
// //         // Render Expenses Table
// //         renderExpensesTable(data.expenses, data.user.currency);

// //     } catch (error) {
// //         console.error('Error loading expenses data:', error);
// //         showErrorMessage('Failed to load expense records. Please try again.');
// //     }
// // }

// // function renderSummary(user, summary) {
// //     const userNameElement = document.getElementById('user-name');
// //     const totalExpensesElement = document.getElementById('total-expenses');

// //     if (userNameElement) userNameElement.textContent = user.name;
// //     if (totalExpensesElement) {
// //         totalExpensesElement.textContent = formatCurrency(summary.total_expenses, user.currency);
// //     }
// // }

// // function renderExpensesTable(expenses, currency = 'USD') {
// //     //get the body of the table give it an id you can call it with
// //     const tbody = document.getElementById('expenses-table-body');
// //     if (!tbody) return;

  
// //     tbody.innerHTML = '';

// //     if (expenses.length === 0) {
// //         tbody.innerHTML = `<tr><td colspan="6" class="text-center">No expenses found.</td></tr>`;
// //         return;
// //     }


// //     const fragment = document.createDocumentFragment();

// //     expenses.forEach(item => {
// //         const row = document.createElement('tr');
// //         row.dataset.id = item.id;

// //         row.innerHTML = `
// //             <td>${formatDate(item.date)}</td>
// //             <td><span class="category-tag">${escapeHtml(item.category)}</span></td>
// //             <td>${escapeHtml(item.description)}</td>
// //             <td>${escapeHtml(item.payment_method)}</td>
// //             <td class="amount">${formatCurrency(item.amount, currency)}</td>
// //             <td><span class="status-badge status-${item.status.toLowerCase()}">${escapeHtml(item.status)}</span></td>
// //         `;

// //         fragment.appendChild(row);
// //     });

// //     tbody.appendChild(fragment);
// // }


// function formatCurrency(amount, currency = 'USD') {
//     return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: currency
//     }).format(amount);
// }

// function formatDate(dateString) {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
// }

// function escapeHtml(str) {
//     return String(str).replace(/[&<>"']/g, match => {
//         const map = {
//             '&': '&amp;',
//             '<': '&lt;',
//             '>': '&gt;',
//             '"': '&quot;',
//             "'": '&#039;'
//         };
//         return map[match];
//     });
// }

// function showErrorMessage(message) {
//     const container = document.getElementById('dashboard-container') || document.body;
//     const errorDiv = document.createElement('div');
//     errorDiv.className = 'error-alert';
//     errorDiv.textContent = message;
//     container.prepend(errorDiv);
// }


// create a function that puts your name in the user-name span 


async function  addName(){
  
  const response = await fetch("sample.json");
  const userData = await response.json();

  //userData = {name:Taiwo, money:5000, state:kwara, school:Labe igi} userData.name
  const userName = document.getElementById("user-name")
  userName.textContent = userData.name

  const expenses = document.getElementById("total-expenses")
  expenses.textContent = userData.money

  const stateOfOrigin = document.getElementById("user-state")
  stateOfOrigin.textContent = userData.state

  const userSchool = document.getElementById("user-school")
  userSchool.textContent = userData.school
 
}

addName()
PopulateTable()

async function PopulateTable(){

  const response = await fetch("expenses.json");
  const userData = await response.json();

  const tableData = userData.expenses    

  console.log(tableData)
  tableData.forEach(item => {
   const Row = document.createElement('tr')
   Row.innerHTML = `
      <td>${item.date} </td>
      <td>${item.category}</td>
      <td>${item.description}</td>
      <td>${item.payment_method}</td>
      <td>${item.amount}</td>
      <td>${item.status}</td>
      `
    const expenseTable = document.getElementById("expenses-table-body")
    expenseTable.appendChild(Row)

    //appendchild to expenseTable so expenseTable.appendchild -> outerhtml
  });
  
}

const addExpenseBtn = document.getElementById("addExpenseBtn");
const expensePopover = document.getElementById("expensePopover");

addExpenseBtn.addEventListener("click", () => {
  expensePopover.classList.toggle("show");
});

    