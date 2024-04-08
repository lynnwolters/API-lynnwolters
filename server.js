import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const engine = new Liquid({
  extname: '.liquid'
});

const app = new App();

app
  .use(logger())
  .use('/', sirv('src'))
  .listen(3000);

  app.get('/', async (req, res) => {
    const edamamData = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}&ingr=banana,pear,apple`)
      .then(res => res.json());
  
    // Controleer of er data is ontvangen
    if (edamamData.parsed) {
      // Loop door elk voedingsmiddel in de array
      edamamData.parsed.forEach(foodItem => {
        // Log de nutrients voor elk voedingsmiddel
        console.log(foodItem.food.nutrients);
      });
    } else {
      console.log('Geen data ontvangen van Edamam API');
    }
  
    return res.send(renderTemplate('views/index.liquid', { title: 'edamamData', edamamData }));
  });

const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};

