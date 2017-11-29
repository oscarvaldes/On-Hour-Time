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
    "aj@gmail.com": ["foo", {id:0, name: "AJ"}],
    "syed@gmail.com": ["bar", {id: 1, name: "Syed"}],
    "oscar@gmail.com": ["hello", {id: 2, name: "Oscar"}],
    "andy@gmail.com": ["world", {id: 3, name: "Andy"}]
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

app.get('/dashboard', require_authentication, function (req, res) {
  res.render("dashboard", {
    events: [{
      name: "Study Session",
      id: "1"
    }]
  });
});


app.get('/event/new', require_authentication, function (req, res) {
  res.render("make-event");
});

app.post('/event/new', require_authentication, function (req, res) {
  // 
});

app.get('/event/:id', require_authentication, function (req, res) {
  const heatmap = {};

  const user1 = [
    "1511971200",
    "1511982000",
    "1511985600",
    "1511989200",
    "1511992800"
  ]

  user1.forEach((time) => {
    if (heatmap[time]) {
      heatmap[time] += 1
    } else {
      heatmap[time] = 1
    }
  });

  const user2 = [
    "1511971200",
    "1511974800",
    "1511978400",
    "1511982000",
    "1511985600",
    "1511989200",
    "1511992800"
  ]

  user2.forEach((time) => {
    if (heatmap[time]) {
      heatmap[time] += 1
    } else {
      heatmap[time] = 1
    }
  });

  const user3 = [
    "1511971200",
    "1511960400",
    "1511964000",
    "1511992800"
  ];

  user3.forEach((time) => {
    if (heatmap[time]) {
      heatmap[time] += 1
    } else {
      heatmap[time] = 1
    }
  });

  console.log(`JSON.stringify(heatmap): ${JSON.stringify(heatmap)}`);

  res.render("heatmap", {
    heatmapData: heatmap,
    event: {
      id: req.params.id,
      title: "Hello World",
      description: "foo bar",
      participants: ["hello@world.com", "123"]
    }
  });
});

app.get('/participate/:id', require_authentication, function (req, res) {
  if (res.locals.user === undefined) {
    res.redirect('/login');
  }
  res.render("participant", {
    startDate: 1511981829,
    eventId: req.params.id || 123,
    userId: 456,
    event: {
      title: "Study Group",
      description: "foo bar",
      organizer: {
        name: "John Doe",
        email: "jd2017@gmail.com"
      }
    }
  });
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
