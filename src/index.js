// MAIN CSS IMPORTEREN
import './styles.css';

// JAVASCRIPT CLASSES IMPORTEREN
import { App } from './scripts/app.js';

// APP CLASS INITIALISEREN BIJ ELKE DOMCONTENTLOADED
document.addEventListener('DOMContentLoaded', () => { 
    const app = new App();
});

