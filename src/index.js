const handlebars = require('express-handlebars');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;
const route = require('./routes');
const db =require('./config/db');
const methodOverride = require('method-override');

const sortMiddleware = require('./app/middleware/SortMiddleware');


//Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

app.use(methodOverride('_method'))



app.use(sortMiddleware);

// app.use(morgan('combined'));
//Template engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a,b)=> a+b,
      sortable: (field, sort)=>{

        const sortType = field===sort.column ? sort.type :'default';

        const icons={
          default:'fa-solid fa-sort',
          asc:'fa-solid fa-sort-down',
          desc:'fa-solid fa-sort-up'
        };

        const types={
          default:'desc',
          asc:'desc',
          desc:'asc',
        }

        const icon = icons[sortType]
        const type = types[sortType]

        return `<a href="?_sort&column=${field}&type=${type}">
          <i class="${icon}"></i>`
      },
  }
  }),
);
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'resources','views'));

route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
