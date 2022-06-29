"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const addUserBtn = document.getElementById('addUserBtn');
    const usersTable = document.getElementById('tbody');
    const insertTableRow = (table, data) => {
        const row = usersTable.insertRow(0);
        row.id = data.id;
        const idCell = row.insertCell(0);
        idCell.innerHTML = data.id;
        const nameCell = row.insertCell(1);
        nameCell.innerHTML = data.name;
        const emailCell = row.insertCell(2);
        emailCell.innerHTML = data.email;
        const optionsCell = row.insertCell(3);
        optionsCell.innerHTML = `<input type="button" value="deactivate" class="btn btn-danger" >`;
        const deactivateButton = optionsCell.querySelector('input');
        deactivateButton.addEventListener('click', function handleClick(event) {
            return __awaiter(this, void 0, void 0, function* () {
                const td = event.target.parentNode;
                const tr = td.parentNode;
                const userID = tr.id;
                deactivateUser({ userID });
            });
        });
    };
    const deleteTableRow = (table, data) => {
        const rowid = data.id;
        const row = document.getElementById(rowid);
        row.parentNode.removeChild(row);
    };
    const displayUsersTable = (usersTable, users) => {
        users.forEach(user => {
            insertTableRow(usersTable, user);
        });
    };
    const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
        const req = yield fetch('/interanl/users/list/get');
        const { users } = yield req.json();
        return users;
    });
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const req = yield fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const res = yield req.json();
        insertTableRow(usersTable, res.user);
    });
    const deactivateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const req = yield fetch('/user/deactivate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const res = yield req.json();
        deleteTableRow(usersTable, res.user);
    });
    const users = yield getUsers();
    displayUsersTable(usersTable, users);
    addUserBtn.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const name = nameInput.value;
        const email = emailInput.value;
        if (name.trim() == "" || email.trim() == "") {
            return alert('fill inputs please!!');
        }
        const user = { name, email };
        yield addUser(user);
        nameInput.value = '';
        emailInput.value = '';
    }));
}));
