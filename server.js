// IMPORTEREN VAN PACKAGES
import 'dotenv/config'; // Package om api key te beschermen
import { App } from '@tinyhttp/app'; // Gebruik maken van http requests
import { logger } from '@tinyhttp/logger'; // Http requests / server activiteit loggen
import { Liquid } from 'liquidjs'; // Data op een dynamische manier in html inladen
import { urlencoded } from 'milliparsec'; // Requests beschikbaar maken voor serverlogica
import sirv from 'sirv'; // Statische bestanden terug serveren naar de client bij een request

// LIQUID INITIALISEREN
const engine = new Liquid({ 
  extname: '.liquid' // Liquid logica gebruiken in bestanden met deze extensie naam 
});

// APP INITIALISEREN
const app = new App();
app
  .use(urlencoded()) // Milliparsec initialiseren
  .use(logger()) // Tinyhttp/logger initialiseren
  .listen(3000); // Server is beschikbaar op poort 3000
  if (process.NODE_ENV === 'production') { // Als environment production is
    app.use('/', sirv('dist/assets')); // Serveer dan vanuit dist/assets
  } else {
    app.use('/', sirv('src')); // Anders vanuit src
  }

// CUSTOM IMAGES TOEVOEGEN AAN DE PRODUCTEN VAN EDAMAM API
const customImages = {
  avocado: './images/avocado.jpg',
  pecan: './images/pecan.jpg',
  peanut_butter: './images/peanut-butter.jpg',
  banana: './images/banana.jpg',
  rice: './images/rice.jpg',
  dried_fruit: './images/dried-fruit.jpg',
  steak: './images/steak.jpg',
  date: './images/date.jpg',
  salmon: './images/salmon.jpg',
  chicken: './images/chicken.jpg',
  lentil: './images/lentil.jpg',
  hummus: './images/hummus.jpg'
};

// INDEX VIEW
app.get('/', async (req, res) => {
  return res.send(renderTemplate('views/index.liquid', { title: 'Index', slug: 'index', foodData: {} }));
});

// INTRODUCTION 1 VIEW
app.get('/introduction-1', async (req, res) => {
  return res.send(renderTemplate('views/introduction-1.liquid', { title: 'Introduction-1', slug: 'introduction-1', foodData: {} }));
});

// INTRODUCTION 2 VIEW
app.get('/introduction-2', async (req, res) => {
  return res.send(renderTemplate('views/introduction-2.liquid', { title: 'Introduction-2', slug: 'introduction-2', foodData: {} }));
});

// INTRODUCTION 3 VIEW
app.get('/introduction-3', async (req, res) => {
  return res.send(renderTemplate('views/introduction-3.liquid', { title: 'Introduction-3', slug: 'introduction-3', foodData: {} }));
});

// HOME VIEW
app.get('/home', async (req, res) => { // Get request naar /home
  try {
    const ingredients = ['avocado', 'pecan', 'peanut~butter', 'banana', 'rice', 'dried~fruit', 'steak', 'date', 'salmon', 'chicken', 'lentil', 'hummus']; // Lijst met ingrediënten
    const randomizedIngredients = ingredients.sort(() => Math.random() - 0.5); // Ingrediënten sorteren op een willekeurige volgorde
    const ingredientParams = randomizedIngredients.slice(0, 6).join(','); // Selecteer de eerste 6 ingrediënten van randomnizedIngredients
    const ingredientsDataPromise = fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.API_ID_FOOD}&app_key=${process.env.API_KEY_FOOD}&ingr=${ingredientParams}`) // Api call naar edamam api
      .then(res => res.json()); // Data omzetten naar json format
    const [ingredientsData] = await Promise.all([ingredientsDataPromise]); // Wacht op een antwoord vanuit edamam api en stop het daarna in de ingredienstData array
    if (ingredientsData.parsed) { // Als de ingredientsData data bevat
      console.log('Ingredients Data Home:', ingredientsData.parsed); // Log dan de desbetreffende data
    } else { // Anders
      console.log('No data received from Edamam API'); // Geef een bericht dat het ophalen niet is gelukt
    }
    ingredientsData.parsed.forEach(item => { // Geef parameter aan elk ingrediënt in opgehaalde ingredientsData
      const ingredientName = item.food.label.toLowerCase().replace(/ /g, '_').replace(/~/g, '_'); // Transformeer elk item naar lowercase + vervang spatie / speciaal teken door een lage streep
      item.customImage = customImages[ingredientName]; // Voeg customImages toe aan item
      item.slug = item.food.label.replace(' ', '-').toLowerCase(); // Voeg url toe aan item
    });
    return res.send(renderTemplate('views/home.liquid', { title: 'Home', slug: 'home', ingredientsData: ingredientsData.parsed })); // Geef als antwoord het gerenderde template object door aan home.liquid met de opgehaalde data
  } catch (error) { // Als er een error is
    console.error('Error fetching data from Edamam API:', error); // Geef dan dit error bericht mee in de console
    return res.status(500).send('Error fetching data from Edamam API'); // Stuur dan dit error bericht mee aan de client
  }
});

// SEARCH-BAR 
app.post('/search', async (req, res) => { // Post request in /search (search-bar)
  const query = req.body['search-bar']; // Pak de tekst die in de search-bar is getypt
  console.log('Search term:', query); // Log de tekst die in de search-bar is getypt
  res.redirect(`/search?q=${encodeURIComponent(query)}`); // Tekst die in de search-bar is getypt doorsturen naar /search?q=
});

// SEARCH OVERVIEW
app.get('/search', async (req, res) => { // Get request naar /search?
  const query = req.query.q; // Pak de parameter 'q' uit de request url
  try {
    const autocompleteDataPromise = fetch(`https://api.edamam.com/auto-complete?app_id=${process.env.API_ID_FOOD}&app_key=${process.env.API_KEY_FOOD}&q=${query}`) // Api call naar edamam auto-complete api gebasseerd op de query
      .then(res => res.json()); // Data omzetten naar json format
    const autocompleteData = await autocompleteDataPromise; // Wacht op een antwoord vanuit edamam auto-complete api en stop het daarna in de autocompleteData variable
    const formattedAutocompleteData = autocompleteData.map(item => ({ // Maak aanpassingen op de bestaande autocompleteData variable d.m.v. .map functie
      name: item.charAt(0).toUpperCase() + item.slice(1), // Name laten beginnen met hoofdletter
      slug: item.replace(' ', '-').toLowerCase() // Bestaande url uit autocompleteData variable naar lowercase veranderen + spaties omzetten naar lage streepjes
    }));
    return res.send(renderTemplate('views/search-results.liquid', { title: 'Search Results', slug: 'search-results', autocompleteData: formattedAutocompleteData, searchTerm: query })); // Geef als antwoord het gerenderde template object door aan search-results.liquid met de opgehaalde data 
  } catch (error) { // Als er een error is
    console.error('Error fetching autocomplete data from Edamam API:', error); // Geef dan dit error bericht mee in de console
    return res.status(500).send('Error fetching autocomplete data from Edamam API'); // Stuur dan dit error bericht mee aan de client
  }
});

// FILTER VIEW
app.get('/filter', async (req, res) => {
  return res.send(renderTemplate('views/filter.liquid', { title: 'Filter', slug: 'filter', foodData: {} }));
});

// SAVED VIEW
app.get('/saved', async (req, res) => {
  return res.send(renderTemplate('views/saved.liquid', { title: 'Saved', slug: 'saved', foodData: {} }));
});

// DETAIL VIEW
app.get('/:ingredient', async (req, res) => { // Get request naar dynamische view /:ingredient
  let ingredientSlug = req.params.ingredient; // Pak de parameter 'ingredient' uit de request url
  const ingredientsDataPromise = fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.API_ID_FOOD}&app_key=${process.env.API_KEY_FOOD}&ingr=${ingredientSlug}`) // Api call naar edamam api gebasseerd op de ingredientSlug
      .then(res => res.json()); // Data omzetten naar json format
      const [ingredientsData] = await Promise.all([ingredientsDataPromise]); // Wacht op een antwoord vanuit edamam api en stop het daarna in de ingredientsData array
      console.log('Ingredients Data Detail:', ingredientsData.parsed); // Log de opgehaalde ingredientsData in de console
  return res.send(renderTemplate('views/detail.liquid', { title: 'Detail', slug: 'detail', ingredientsData: ingredientsData.parsed[0], image: customImages[ingredientSlug] })); // Geef als antwoord het gerenderde template object door aan detail.liquid met de opgehaalde data
});

// DATA RENDEREN VAN API NAAR LIQUID
const renderTemplate = (template, data) => { // Template = pad naar bestand dat gerenderd moet worden, data = data dat moet worden doorgegeven aan het bestand
  const templateData = { // Template object wordt aangemaakt
    NODE_ENV: process.env.NODE_ENV || 'production', // Als 'process.env.NODE_ENV' het niet doet, gebruik dan 'production'
    ...data // Stuur data mee aan template object
  };
  return engine.renderFileSync(template, templateData); // Gerenderde template object doorgeven
};

