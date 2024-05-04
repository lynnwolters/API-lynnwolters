// FILTERFUNCTION CLASS MAKEN
export class FilterFunction {
    constructor () {
        this.filterButtonCategory = document.getElementById('filter-button-category'); // Haal #filter-button-category op
        if (!this.filterButtonCategory) { // Als filterButtonCategory niet aanwezig is
            return false; // Voer de functie dan niet uit
        }
        this.filterButtonRichIn = document.getElementById('filter-button-rich-in'); // Haal #filter-button-rich-in op
        this.filterCategory = document.getElementById('filter-category'); // Haal #filter-category op
        this.filterRichIn = document.getElementById('filter-rich-in'); // Haal #filter-rich-in op
        this.init(); // Voer init functie uit
    }

    init = () => {
        this.bindEvents(); // Voer bindEvents functie uit
        this.bindDocumentClick(); // Voer bindDocumentClick functie uit (wordt er ergens anders op geklikt naast de filters, zodat de filters zich ook dan sluiten)
    };

    bindEvents = () => {
        this.filterButtonCategory.addEventListener('click', () => this.toggleFilterFunction('filter-category', 'filter-rich-in')); // Voeg click gebeurtenis toe aan filterButtonCategory, als je erop klikt voer dan de toggleFilterFunction functie uit en geef twee argumenten mee
        this.filterButtonRichIn.addEventListener('click', () => this.toggleFilterFunction('filter-rich-in', 'filter-category')); // Voeg click gebeurtenis toe aan filterButtonRichIn, als je erop klikt voer dan de toggleFilterFunction functie uit en geef twee argumenten mee
    };

    toggleFilterFunction = (filterToOpen, filterToClose) => { // De functie verwacht twee argumenten
        const filterToOpenElem = document.getElementById(filterToOpen); // Haal het dom element op dat overeenkomt met de filterToOpen parameter en stop het in een variable genaamd filterToOpenElem
        const filterToCloseElem = document.getElementById(filterToClose); // Haal het dom element op dat overeenkomt met de filterToClose parameter en stop het in een variable genaamd filterToCloseElem
        if (filterToCloseElem.classList.contains('open')) { // Als de filterToCloseElem de .open class bevat
            filterToCloseElem.classList.remove('open'); // Verwijder dan de .open class
        }
        filterToOpenElem.classList.toggle('open'); // Voeg de .open class toe aan filterToOpenElem afhankelijk of die al aanwezig is of niet
    };

    bindDocumentClick = () => {
        document.addEventListener('click', (event) => { // Voeg click gebeurtenis toe aan parameter 'event'
            const isFilterButtonCategoryClicked = event.target === this.filterButtonCategory; // Is het element waar je op klikt (event.target) gelijk aan filterButtonCategory
            const isFilterButtonRichInClicked = event.target === this.filterButtonRichIn; // Is het element waar je op klikt (event.target) gelijk aan filterButtonRichIn
            if (!isFilterButtonCategoryClicked && !isFilterButtonRichInClicked) { // Als isFilterButtonCategoryClicked en isFilterButtonRichInClicked niet waar is 
                this.closeFilters(); // Sluit dan de filters
            }
        });
    };

    closeFilters = () => {
        const filtersToClose = [this.filterCategory, this.filterRichIn]; // Haal de elementen die zich moeten sluiten op
        filtersToClose.forEach(filter => { // Geef parameter mee aan filtersToClose
            if (filter.classList.contains('open')) { // Als filter parameter de .open class bevat
                filter.classList.remove('open'); // Verwijder dan de .open class
            }
        });
    };
}
