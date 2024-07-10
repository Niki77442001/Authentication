document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const expenseForm = document.getElementById('expenseForm');
    const expenseTable = document.getElementById('expenseTable').querySelector('tbody');


    let users = JSON.parse(localStorage.getItem('users')) || [];
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    //  sign up
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Sign up successful!');
            window.location.href = 'Login_Page.html';
        });
    }

    //  login
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'Index.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }

    //  adding expense
    if (expenseForm) {
        expenseForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const category = document.getElementById('category').value;
            const amount = document.getElementById('amount').value;
            const comments = document.getElementById('comments').value;
            const createdAt = new Date().toLocaleString();
            const updatedAt = createdAt;
            const id = Date.now();
            expenses.push({ id, category, amount, comments, createdAt, updatedAt });
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
            expenseForm.reset();
        });
    }

    // Render expenses in the table
    function renderExpenses() {
        expenseTable.innerHTML = '';
        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.category}</td>
                <td>${expense.amount}</td>
                <td>${expense.createdAt}</td>
                <td>${expense.updatedAt}</td>
                <td>${expense.comments}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expenseTable.appendChild(row);
        });

        //  for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    //  editing expense
    function handleEdit(e) {
        const id = e.target.dataset.id;
        const expense = expenses.find(expense => expense.id == id);
        document.getElementById('category').value = expense.category;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('comments').value = expense.comments;
        expenseForm.querySelector('button').textContent = 'Update Expense';
        expenseForm.onsubmit = function (e) {
            e.preventDefault();
            expense.category = document.getElementById('category').value;
            expense.amount = document.getElementById('amount').value;
            expense.comments = document.getElementById('comments').value;
            expense.updatedAt = new Date().toLocaleString();
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
            expenseForm.reset();
            expenseForm.querySelector('button').textContent = 'Add Expense';
            expenseForm.onsubmit = null;
        };
    }

    // deleting expense
    function handleDelete(e) {
        const id = e.target.dataset.id;
        expenses = expenses.filter(expense => expense.id != id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }

    // Initial rendering of expenses
    if (expenseTable) {
        renderExpenses();
    }
})
