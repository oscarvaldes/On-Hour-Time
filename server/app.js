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
// app.use(express.static(path.join(__dirname, '../client')));
// app.use('/scheduler', scheduler);
// app.use('/login', login);
// app.use('/register', register);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler (no stack-traces)
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

app.use(function(req, res, next) {
  res.locals.user = null;
  next();
});

// todo: make authentication work
app.get(['/', '/login'], function (req, res) {
  res.render("login");
});

// todo: make authentication work
app.get('logout', function (req, res) {
  res.render("login");
});

app.get('/dashboard', function (req, res) {
  res.render("dashboard", {
    events: [{
      name: "Study Session",
      id: "1"
    }]
  });
});


app.get('/event/new', function (req, res) {
  res.render("make-event");
});

app.get('/event/:id', function (req, res) {
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

app.get('/participate/:id', function (req, res) {
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


module.exports = app;
