const usersPerPage = 10;
let currentPage = 1;
let usersData = [];

// Function to fetch user data from the API endpoint
async function fetchUserData() {
  try {
    const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    usersData = data; // Assuming data is an array of user objects
    displayUsers(currentPage);
  } catch (error) {
    console.error('There was a problem fetching user data:', error);
    // Handle the error accordingly
  }
}

// Function to display users in the table for the given page
function displayUsers(page) {
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const users = usersData.slice(startIndex, endIndex);

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  users.forEach(user => {
    const row = `<tr>
      <td><input type="checkbox" data-id="${user.id}"></td>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editRow(${user.id})" class="edit">Edit</button>
        <button onclick="saveChanges(${user.id})" class="save">Save</button>
        <button onclick="deleteRow(${user.id})" class="delete">Delete</button>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });

  updatePagination();
}

// Function to update pagination UI
function updatePagination() {
  const totalPages = Math.ceil(usersData.length / usersPerPage);
  const pageNumbers = document.getElementById('pageNumbers');
  pageNumbers.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = `<button onclick="changePage(${i})">${i}</button>`;
    pageNumbers.innerHTML += button;
  }
}

// Function to change the current page
function changePage(page) {
  currentPage = page;
  displayUsers(currentPage);
}

// Function to go to the first page
function firstPage() {
  currentPage = 1;
  displayUsers(currentPage);
}

// Function to go to the previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayUsers(currentPage);
  }
}

// Function to go to the next page
function nextPage() {
  const totalPages = Math.ceil(usersData.length / usersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayUsers(currentPage);
  }
}

// Function to go to the last page
function lastPage() {
  const totalPages = Math.ceil(usersData.length / usersPerPage);
  currentPage = totalPages;
  displayUsers(currentPage);
}

// Function to trigger search on pressing ENTER
function searchOnEnter(event) {
  if (event.key === 'Enter') {
    search();
  }
}

// Function to filter users based on search input
function search() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  if (searchTerm === '') {
    // If the search box is empty, display all users
    usersData = [...originalUsersData];
    currentPage = 1;
    displayUsers(currentPage);
  } else {
    const filteredUsers = originalUsersData.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.id.toString().toLowerCase().includes(searchTerm)
    );

    if (filteredUsers.length > 0) {
      usersData = filteredUsers;
      currentPage = 1;
      displayUsers(currentPage);
    } else {
      alert('No results found.');
    }
  }
}

// Function to edit a row
function editRow(userId) {
  const editedRow = document.querySelector(`[data-id="${userId}"]`).parentNode.parentNode;

  // Example: Making the row editable
  editedRow.contentEditable = true;
  editedRow.classList.add('editable');
}

// Function to save changes made in a row
function saveChanges(userId) {
  const editedRow = document.querySelector(`[data-id="${userId}"]`).parentNode.parentNode;
  const editedEmail = editedRow.querySelector('td:nth-child(3)').innerText;

  // Example: Validating the email format before saving changes
  if (!isValidEmail(editedEmail)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Example: Saving changes made in an editable row
  editedRow.contentEditable = false;
  editedRow.classList.remove('editable');
}

// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
  
  // Function to delete a row
  function deleteRow(userId) {
    const rowToDelete = document.querySelector(`[data-id="${userId}"]`).parentNode.parentNode;
  
    // Example: Deleting the row
    rowToDelete.remove();
  }

// Function to delete selected rows
function deleteSelected() {
  const selectedCheckboxes = document.querySelectorAll('#tableBody input[type="checkbox"]:checked');
  const selectedIds = Array.from(selectedCheckboxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));

  if (selectedIds.length > 0) {
    usersData = usersData.filter(user => !selectedIds.includes(user.id));
    displayUsers(currentPage); // Update the displayed table after deletion
  } else {
    alert('Please select at least one row to delete.');
  }
}

// Function to toggle select/deselect all rows
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('#tableBody input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
    // Handle row selection logic here (add/remove 'selected' class if needed)
  });
}


// Fetch user data and display initial page
fetchUserData()
  .then(() => {
    originalUsersData = [...usersData]; // Store the original unfiltered data
    displayUsers(currentPage);
  })
  .catch(error => {
    console.error('Error fetching or displaying user data:', error);
  });

// Other functionalities like sorting, validation, etc., can be added as needed.
