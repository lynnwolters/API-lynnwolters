// IMPORTS
import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import { urlencoded } from 'milliparsec'
import sirv from 'sirv';

// ADD LIQUID
const engine = new Liquid({
  extname: '.liquid'
});

const customImages = {
  avocado: './images/avocado.jpg',
  pecan: './images/pecan.jpg',
  peanut_butter: './images/peanut-butter.jpg',
  banana: './images/banana.jpg',
  rice: './images/rice.jpg',
  dried_fruit: './images/dried-fruit.jpg',
  steak: './images/steak.jpg',
  egg: './images/egg.jpg',
  date: './images/date.jpg',
  salmon: './images/salmon.jpg',
  chicken: './images/chicken.jpg',
  lentil: './images/lentil.jpg',
  hummus: './images/hummus.jpg'
};


// INITIALIZE APP
const app = new App();
app
  .use(urlencoded())
  .use(logger())
  .use('/', sirv('src'))
  .listen(3000);

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
app.get('/home', async (req, res) => {
  try {
    const ingredients = ['avocado', 'pecan', 'peanut~butter', 'banana', 'rice', 'dried~fruit', 'steak', 'egg', 'date', 'salmon', 'chicken', 'lentil', 'hummus'];
    const randomizedIngredients = ingredients.sort(() => Math.random() - 0.5);
    const ingredientParams = randomizedIngredients.slice(0, 6).join(',');

    const ingredientsDataPromise = fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.API_ID_FOOD}&app_key=${process.env.API_KEY_FOOD}&ingr=${ingredientParams}`)
      .then(res => res.json());

    const [ingredientsData] = await Promise.all([ingredientsDataPromise]);
    // console.log(ingredientsData);
    if (ingredientsData.parsed) {
      console.log(ingredientsData.parsed);
    } else {
      console.log('No data received from Edamam API');
    }
  
    ingredientsData.parsed.forEach(ingredientItem => {
      const ingredientName = ingredientItem.food.label.toLowerCase().replace(/ /g, '_').replace(/~/g, '_');
      ingredientItem.customImage = customImages[ingredientName];
      ingredientItem.slug = ingredientItem.food.label.replace(' ', '-').toLowerCase();
    });
    
    return res.send(renderTemplate('views/home.liquid', { title: 'Home', slug: 'home', ingredientsData: ingredientsData.parsed }));
  } catch (error) {
    console.error('Error fetching data from Edamam API:', error);
    return res.status(500).send('Error fetching data from Edamam API');
  }
});

app.post('/search', async (req, res) => {
  console.log(req.body);
  res.redirect('/search?q='+req.body['search-bar']);
});

// SEARCH OVERVIEW
app.get('/search?', async (req, res) => {
  const query = req.query.q;

  const autocompleteDataPromise = fetch(`https://api.edamam.com/auto-complete?app_id=${process.env.API_ID_FOOD}&app_key=${process.env.API_KEY_FOOD}&q=${query}`)
      .then(res => res.json());
      let [autocompleteData] = await Promise.all([autocompleteDataPromise]);
      autocompleteData = autocompleteData.map(data => {
        let newData = []
        newData.name = data
        newData.slug = data.replace(' ', '-').toLowerCase();
        return newData;
      })
      console.log(autocompleteData);
  return res.send(renderTemplate('views/search-results.liquid', { title: 'Detail', slug: 'detail', autoCompleteData: autocompleteData }));
});

// PRODUCT VIEW
app.get('/:ingredient', async (req, res) => {
  const ingredientSlug = req.params.ingredient;
  const ingredientsDataPromise = fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.API_ID_FOOD}&app_key=${process.env.API_KEY_FOOD}&ingr=${ingredientSlug}`)

      .then(res => res.json());
      const [ingredientsData] = await Promise.all([ingredientsDataPromise]);
      console.log(ingredientsData.parsed);
  return res.send(renderTemplate('views/detail.liquid', { title: 'Detail', slug: 'detail', foodData: ingredientsData.parsed[0], image: customImages[ingredientSlug] }));
});

// FILTER VIEW
app.get('/filter', async (req, res) => {
  return res.send(renderTemplate('views/filter.liquid', { title: 'Filter', slug: 'filter', foodData: {} }));
});

// FILTER VIEW
app.get('/saved', async (req, res) => {
  return res.send(renderTemplate('views/saved.liquid', { title: 'Saved', slug: 'saved', foodData: {} }));
});

// RENDER DATA FROM API TO LIQUID
const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };
  return engine.renderFileSync(template, templateData);
};

