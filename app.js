const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const morgan = require( 'morgan' );
const routes = require( './routes/api' );

const webDriver = require( 'selenium-webdriver' ),
  By = webDriver.By,
  until = webDriver.until;

const driver = new webDriver.Builder()
  .forBrowser('chrome')
  .build();

driver.get('http://www.google.com/ncr');
driver.findElement(By.name('q')).sendKeys('webdriver');
driver.findElement(By.name('btnG')).click();
driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.quit();

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'public/index.html')));

// ......error middleware not wired to anything.
// ......error status sent back to index.html

app.use((req, res, next) => {
  const error = new Error('page not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

module.exports = app;
