// DELETEFUNCTION CLASS MAKEN
export class DeleteFunction {
    constructor () {
        this.deleteButton = document.getElementById('delete-button'); // Haal #delete-button op
        if (!this.deleteButton) { // Als deleteButton niet aanwezig is
            return false; // Voer de functie dan niet uit
        }
        this.init(); // Voer init functie uit
    }

    init = () => {
        this.bindEvents(); // Voer bindEvents functie uit
    };

    bindEvents = () => {
        this.deleteButton.addEventListener('click', this.toggleDeleteFunction); // Voeg click gebeurtenis toe aan deleteButton en voer de toggleDeleteFunction uit als je erop klikt
    };

    toggleDeleteFunction = () => {
        let selectAllButton = document.getElementById('select-all-button'); // Haal #select-all-button op
        selectAllButton.classList.toggle('open'); // Toggle selectAllButton 
    };
}