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
    moment = require('moment'),
    app = express();

const session = require('express-session');
const request = require('request');

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
app.use(express.static(path.join(__dirname, '../client2')));
app.use('/scheduler', scheduler);
app.use('/login2', login);
app.use('/register', register);

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
    "anuragb2010@gmail.com": ["foo", {id:0, name: "AJ", "email": "anuragb2010@gmail.com"}],
    "swh48554@uga.edu": ["bar", {id: 1, name: "Syed", "email": "swh48554@uga.edu"}],
    "oscarito@uga.edu": ["hello", {id: 2, name: "Oscar", "email": "oscarito@uga.edu"}],
    "ac31128@uga.edu": ["world", {id: 3, name: "Andy", "email": "ac31128@uga.edu"}]
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
      email: "anuragb2010@gmail.com"
    },
    participants: ["swh48554@uga.edu", "oscarito@uga.edu", "ac31128@uga.edu"],
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

  const payload = {
    name: req.body.name,
    // TODO: BRAH DON"T FORGET HTIS SHIT
    url: "http://ff54432b.ngrok.io " + "/event/" + req.body.id,
    participants: req.body.participants.join(","),
    creator: req.body.organizer.name
  };

  console.log(`JSON.stringify(payload): ${JSON.stringify(payload)}`);

  // Set the headers
  var headers = {
      'User-Agent':       'Super Agent/0.0.1',
      'Content-Type':     'application/json'
  }

  // Configure the request
  var options = {
      url: 'http://localhost:5000/initial',
      method: 'POST',
      headers: headers,
      form: payload
  }

  // Start the request
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          console.log(body);
      }
  });
});

app.post('/sendFinalEmail', function (req, res) {
  const finalSelection = req.body.finalSelection;
  const eventId = Number(req.body.eventId);

  console.log(`JSON.stringify(req.body): ${JSON.stringify(req.body)}`);

  // TODO
  const payload = {
    name: eventsDB[eventId].name,
    begin: moment.unix(finalSelection).format('YYYYMMDD HH:mm:ss'),
    end: moment.unix(finalSelection).add(1, 'h').format('YYYYMMDD HH:mm:ss'),
    location: "Boyd Graduate Resarch Center, Room 328",
    participants: eventsDB[eventId].participants.join(","),
    description: eventsDB[eventId].description,
    creator_name: eventsDB[eventId].organizer.name,
    creator_email: eventsDB[eventId].organizer.email
  }

  // Set the headers
  var headers = {
      'User-Agent':       'Super Agent/0.0.1',
      'Content-Type':     'application/json'
  }

  // Configure the request
  var options = {
      url: 'http://localhost:5000/final',
      method: 'POST',
      headers: headers,
      form: payload
  }

  // Start the request
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          console.log(body);
      }
  });


  console.log(`JSON.stringify(req.body): ${JSON.stringify(req.body)}`);
  res.send(req.body);
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

  if (!e.schedules) {
    e.schedules = []
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
