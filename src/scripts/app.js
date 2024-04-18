import { FilterFunction } from './logic/filterFunction.js';
import { DeleteFunction } from './logic/deleteFunction.js';

export class App {
    constructor () {
        this.init();
    }

    init = () => {
        this.filterFunction = new FilterFunction();
        this.deleteFunction = new DeleteFunction();
    };
}