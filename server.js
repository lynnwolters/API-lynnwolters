// IMPORTS
import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

// ADD LIQUID
const engine = new Liquid({
  extname: '.liquid'
});

// INITIALIZE APP
const app = new App();
app
  .use(logger())
  .use('/', sirv('src'))
  .listen(3000);

// INDEX VIEW
app.get('/', async (req, res) => {
  const edamamData = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}&ingr=banana,pear,apple`)
    .then(res => res.json());
  if (edamamData.parsed) {
    edamamData.parsed.forEach(foodItem => {
      console.log(foodItem.food.nutrients);
    });
  } else {
    console.log('No data received from Edamam API');
  }
  return res.send(renderTemplate('views/index.liquid', { title: 'Index', edamamData }));
});

// INTRODUCTION 1 VIEW
app.get('/introduction-1', async (req, res) => {
  return res.send(renderTemplate('views/introduction-1.liquid', { title: 'Introduction-1', slug: 'introduction-1', edamamData: {} }));
});

// INTRODUCTION 2 VIEW
app.get('/introduction-2', async (req, res) => {
  return res.send(renderTemplate('views/introduction-2.liquid', { title: 'Introduction-2', slug: 'introduction-2', edamamData: {} }));
});

// INTRODUCTION 3 VIEW
app.get('/introduction-3', async (req, res) => {
  return res.send(renderTemplate('views/introduction-3.liquid', { title: 'Introduction-3', slug: 'introduction-3', edamamData: {} }));
});

// HOME VIEW
app.get('/home', async (req, res) => {
  return res.send(renderTemplate('views/home.liquid', { title: 'Home', slug: 'home', edamamData: {} }));
});

// PRODUCT VIEW
app.get('/detail', async (req, res) => {
  return res.send(renderTemplate('views/detail.liquid', { title: 'Detail', slug: 'detail', edamamData: {} }));
});

// FILTER VIEW
app.get('/filter', async (req, res) => {
  return res.send(renderTemplate('views/filter.liquid', { title: 'Filter', slug: 'filter', edamamData: {} }));
});

// FILTER VIEW
app.get('/saved', async (req, res) => {
  return res.send(renderTemplate('views/saved.liquid', { title: 'Saved', slug: 'saved', edamamData: {} }));
});

// RENDER DATA FROM API TO LIQUID
const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };
  return engine.renderFileSync(template, templateData);
};

