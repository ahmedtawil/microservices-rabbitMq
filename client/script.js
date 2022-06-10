
document.addEventListener("DOMContentLoaded", async () => {
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
        deactivateButton.addEventListener('click', async function handleClick(event) {
            const td = event.target.parentNode;
            const tr = td.parentNode; 
            const userID = tr.id;
            deactivateUser({userID});

        });
    }

    const deleteTableRow = (table, data) => {
        const rowid = data.id;
        const row = document.getElementById(rowid);
        row.parentNode.removeChild(row);
    }

    const displayUsersTable = (usersTable, users) => {
        users.forEach(user => {
            insertTableRow(usersTable, user);
        });
    }

    const getUsers = async () => {
        const req = await fetch('/interanl/users/list/get');
        const { users } = await req.json();
        return users;
    }

    const addUser = async (user) => {
        const req = await fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const res = await req.json();
        insertTableRow(usersTable, res.user);

    }

    const deactivateUser = async (user) => {
        const req = await fetch('/user/deactivate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const res = await req.json();
        deleteTableRow(usersTable, res.user);

    }

    const users = await getUsers();
    displayUsersTable(usersTable, users);

    addUserBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const email = emailInput.value;

        if(name.trim()=="" || email.trim=="") {
            return alert('fill inputs please!!');
        }
        
        const user = {name , email};
        await addUser(user);

        nameInput.value = '';
        emailInput.value = '';
    })
})


