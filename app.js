const express = require('express');
const fs = require('fs');
const path = require('path');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'directory.json');

// Configure Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    cancelButton: function() {
      return new Handlebars.SafeString('<a href="/" class="btn cancel">Отказаться</a>');
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Helper function to read/write data
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Routes
app.get('/', (req, res) => {
  const entries = readData();
  res.render('home', { entries });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const entries = readData();
  const newEntry = {
    id: entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1,
    name: req.body.name,
    phone: req.body.phone
  };
  entries.push(newEntry);
  writeData(entries);
  res.redirect('/');
});

app.get('/update', (req, res) => {
  const entries = readData();
  const entryId = parseInt(req.query.id);
  const entry = entries.find(e => e.id === entryId);
  
  if (!entry) {
    return res.redirect('/');
  }
  
  res.render('update', { entry, entries });
});

app.post('/update', (req, res) => {
  const entries = readData();
  const entryId = parseInt(req.body.id);
  const entryIndex = entries.findIndex(e => e.id === entryId);
  
  if (entryIndex !== -1) {
    entries[entryIndex] = {
      id: entryId,
      name: req.body.name,
      phone: req.body.phone
    };
    writeData(entries);
  }
  
  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const entries = readData();
  const entryId = parseInt(req.body.id);
  const filteredEntries = entries.filter(e => e.id !== entryId);
  
  writeData(filteredEntries);
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});