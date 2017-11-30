var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser-json'),
    cors = require('cors'),
    scheduler = require('./routes/backend-scheduler-service'),
    login = require('./routes/login-service'),
    register = require('./routes/register-service'),
    app = express();

const session = require('express-session');

app.use(cors());
// app.use(favicon('./client/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
  secret: "ewhfblkhrbrekhagvbr"
}));

app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static(path.join(__dirname, '../client')));
// app.use('/scheduler', scheduler);
// app.use('/login', login);
// app.use('/register', register);

app.use(function setAuthLocal(req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.users = null;
  }
  next();
});

app.get(['/', '/login'], function (req, res) {
  res.render("login");
});

app.post('/login', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  console.log('email', email);
  console.log('password', password);

  let usersDB = {
    "aj@gmail.com": ["foo", {id:0, name: "AJ", "email": "aj@gmail.com"}],
    "syed@gmail.com": ["bar", {id: 1, name: "Syed", "email": "syed@gmail.com"}],
    "oscar@gmail.com": ["hello", {id: 2, name: "Oscar", "email": "oscar@gmail.com"}],
    "andy@gmail.com": ["world", {id: 3, name: "Andy", "email": "andy@gmail.com"}]
  }

  if (usersDB.hasOwnProperty(email) && usersDB[email][0] == password) {
    req.session.user = usersDB[email][1];
    res.redirect('/dashboard'); 
    return;
  } else {
    res.redirect('/');
    return;
  }
}); //router.post

app.get('/logout', require_authentication, function (req, res) {
  delete req.session.user;
  res.render("login");
});

eventsDB = [{
    id: 0,
    startDate: 1511931600,
    name: "Study Group",
    description: "foo bar",
    organizer: {
      name: "John Doe",
      email: "aj@gmail.com"
    },
    participants: ["syed@gmail.com", "oscar@gmail.com", "andy@gmail.com"],
    schedules: []
}]

app.get('/dashboard', require_authentication, function (req, res) {
  res.render("dashboard", {
    events: eventsDB.filter(function (event) {
      return req.session.user.email === event.organizer.email || event.participants.indexOf(req.session.user.email) > -1
    })
  });
});


app.get('/event/new', require_authentication, function (req, res) {
  res.render("make-event");
});

app.post('/event/new', require_authentication, function (req, res) {
  req.body.id = eventsDB.length;
  req.body.organizer = {
    name: res.locals.user.name,
    email: res.locals.user.email
  }
  eventsDB.push(req.body);
  console.log(`JSON.stringify(eventsDB): ${JSON.stringify(eventsDB)}`);
  res.redirect('/dashboard');
});

app.get('/event/:id', require_authentication, function (req, res) {
  const e = eventsDB[req.params.id];
  if (e.participants.indexOf(req.session.user.email) > -1) {
    res.redirect('/participate/' + req.params.id);
    return;
  }

  const heatmap = {};

  if (e.schedules && e.schedules.length > 0) {
    e.schedules.map( (x) => x.timesAvailable ).forEach( (schedule) => {
      schedule.forEach((time) => {
        if (heatmap[time]) {
          heatmap[time] += 1
        } else {
          heatmap[time] = 1
        }
      });
    });
  }


  console.log(`JSON.stringify(heatmap): ${JSON.stringify(heatmap)}`);

  res.render("heatmap", {
    heatmapData: heatmap,
    event: {
      id: e.id,
      title: e.name,
      description: e.description,
      participants: e.participants,
    }
  });
});

app.get('/participate/:id', require_authentication, function (req, res) {
  console.log(`JSON.stringify(eventsDB[req.params.id]): ${JSON.stringify(eventsDB[req.params.id])}`);
  res.render("participant", {
    startDate: 1511981829,
    eventId: req.params.id || 123,
    userId: 0,
    event: eventsDB[req.params.id]
  });
});

app.post('/participate/:id', require_authentication, function (req, res) {
  const email = req.session.user.email;
  const e = eventsDB[req.params.id];

  const new_schedule = {
    email: email,
    timesAvailable: req.body.timesAvailable
  }

  if (e.schedules.length < 1) {
    e.schedules.push(new_schedule);
  } else if (e.schedules.map( x => x.email ).indexOf(email) > -1) { // existing schedule
    e.schedules.forEach(function (schedule, index) {
      if (schedule.email === email) {
        e.schedules[index] = new_schedule;
      }
    })
  } else {
    e.schedules.push(new_schedule)
  }

  res.send(true);

  console.log(`JSON.stringify(e): ${JSON.stringify(e)}`);


});

// helper functions

function require_authentication(req, res, next) {
  if (res.locals.user != null) {
    next();
  } else {
    res.redirect('/');
    return;
  }
}

module.exports = app;
