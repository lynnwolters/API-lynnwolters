export class FilterFunction {
    constructor () {
        this.filterButtonCategory = document.getElementById('filter-button-category');
        if (!this.filterButtonCategory) {
            return false;
        }
        this.filterButtonRichIn = document.getElementById('filter-button-rich-in');
        this.filterCategory = document.getElementById('filter-category');
        this.filterRichIn = document.getElementById('filter-rich-in');
        this.init();
    }

    init = () => {
        this.bindEvents();
        this.bindDocumentClick();
    };

    bindEvents = () => {
        this.filterButtonCategory.addEventListener('click', () => this.toggleFilterFunction('filter-category', 'filter-rich-in'));
        this.filterButtonRichIn.addEventListener('click', () => this.toggleFilterFunction('filter-rich-in', 'filter-category'));
    };

    toggleFilterFunction = (filterToToggle, filterToClose) => {
        const filter = document.getElementById(filterToToggle);
        const filterToCloseElem = document.getElementById(filterToClose);

        if (filterToCloseElem.classList.contains('open')) {
            filterToCloseElem.classList.remove('open');
        }

        filter.classList.toggle('open');
    };

    bindDocumentClick = () => {
        document.addEventListener('click', (event) => {
            const isFilterButtonCategoryClicked = event.target === this.filterButtonCategory;
            const isFilterButtonRichInClicked = event.target === this.filterButtonRichIn;

            if (!isFilterButtonCategoryClicked && !isFilterButtonRichInClicked) {
                this.closeFilters();
            }
        });
    };

    closeFilters = () => {
        const filtersToClose = [this.filterCategory, this.filterRichIn];

        filtersToClose.forEach(filter => {
            if (filter.classList.contains('open')) {
                filter.classList.remove('open');
            }
        });
    };
}
