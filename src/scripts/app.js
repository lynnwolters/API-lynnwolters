// JAVASCRIPT CLASSES IMPORTEREN
import { FilterFunction } from './logic/filterFunction.js';
import { DeleteFunction } from './logic/deleteFunction.js';

// APP CLASS MAKEN
export class App {
    constructor () {
        this.init(); // Voer init functie uit
    }

    init = () => {
        this.filterFunction = new FilterFunction(); // FilterFunction class initialiseren
        this.deleteFunction = new DeleteFunction(); // DeleteFunction class initialiseren
    };
}
