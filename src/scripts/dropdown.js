const dropdownButtonCategory = document.getElementById('dropdown-button-category');
const dropdownButtonRichIn = document.getElementById('dropdown-button-rich-in');

dropdownButtonCategory.addEventListener('click', toggleDropdownCategory);
dropdownButtonRichIn.addEventListener('click', toggleDropdownRichIn);

function toggleDropdownCategory() {
    let dropdownCategory = document.getElementById('dropdown-category');
    dropdownCategory.classList.toggle('open');
}

function toggleDropdownRichIn() {
    let dropdownRichIn = document.getElementById('dropdown-rich-in');
    dropdownRichIn.classList.toggle('open');
}