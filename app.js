var express = require('express');
var socket_io    = require( "socket.io" );
var clientio  = require('socket.io-client');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 
var config      = require('./config/db');
var index = require('./routes/index');
var users = require('./routes/users');
var passport  = require('passport');
var cryptico = require('cryptico-js');


var Pizza = require('./app/models/pizzas');

var app = express();

var stringLlavePublica;

// Socket.io
var io           = socket_io();
app.io           = io;
var client    = clientio.connect('http://127.0.0.1:3013');

client.emit('clave','tobi', function (data) {
    console.log(data); // data will be 'woot'
    stringLlavePublica=data;
});

io.on('connection', function (socket) {
  
    socket.on('validacion', function (data, fn) {
        console.log('#tdc normal: '+data.numeroTDC);
        var numeroString = data.numeroTDC.toString();
        console.log('tdc string: '+ numeroString);

        var resultado = cryptico.encrypt(numeroString, stringLlavePublica);
        data.numeroTDC = resultado.cipher;
        console.log('#tdc cifrado: '+data.numeroTDC);
        
        client.emit('banco', data, function (data) {
          console.log(data.error);
          console.log(data); // data will be 'woot'
         
          fn(data);
        });
    });
});

// pass passport for configuration
require('./config/passport')(passport);

// Use the passport package in our application
app.use(passport.initialize());

/*var clientio  = require('socket.io-client');
var client    = clientio.connect('http://localhost:3013'); //cliente del server

io.sockets.on('connection', function (socket) {
  socket.on('client', function(data) {
    console.log('clientserver data', data);
    client.emit('my event', data);
  });
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(config.database);

var pizzas = [ 
                {
                    id: 001,
                    nombre: 'Prosciutto',
                    ing: ["TOMATE", "MOZZARELLA", "JAMÓN DULCE"],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },
                {
                    id: 002,
                    nombre: 'Diavola',
                    ing: ['CHORIZO PICANTE', 'MOZZARELLA', 'SALSA PICANTE'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },

                {
                    id: 003,
                    nombre: 'Hawaina',
                    ing: ['TOMATE', 'MOZZARELLA', 'PIÑA'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },
                {
                    id: 004,
                    nombre: 'Margarita',
                    ing: ['TOMATE', 'MOZZARELLA', 'ALBAHACA'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },
                {
                    id: 005,
                    nombre: '4 Quesos',
                    ing: ['PROVOLONE', 'MOZZARELLA', 'PARMESANO', 'EMMENTAL'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },
                {
                    id: 006,
                    nombre: 'Pabellón',
                    ing: ['CARAOTAS', 'MOZZARELLA', 'CARNE', 'TAJADAS'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                }
            ];

/*Pizza.insertMany(pizzas)
    .then(function(mongoosePizzas) {
         
         console.log(`Pizzas insertadas: ${mongoosePizzas.lenght}`);
    })
    .catch(function(err) {
        
        console.error(err);
    });*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// routes ==================================================
require('./app/routes')(app); // configure our routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
