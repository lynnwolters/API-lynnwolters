export class DeleteFunction {
    constructor () {
        this.deleteButton = document.getElementById('delete-button');
        if (!this.deleteButton) {
            return false;
        }
        this.init();
    }

    init = () => {
        this.bindEvents();
    };

    bindEvents = () => {
        this.deleteButton.addEventListener('click', this.toggleDeleteFunction);
    };

    toggleDeleteFunction = () => {
        let selectAllButton = document.getElementById('select-all-button');
        selectAllButton.classList.toggle('open');
    };
}