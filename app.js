var express = require('express');
var socket_io    = require( "socket.io" );
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

var index = require('./routes/index');
var users = require('./routes/users');

var Pizza = require('./app/models/pizzas');

var app = express();
//var server = require('http').createServer(app)
//var io = require('socket.io').listen(server); //server


// Socket.io
var io           = socket_io();
app.io           = io;

var clientio  = require('socket.io-client');
var client    = clientio.connect('http://localhost:3013'); //cliente del server

io.sockets.on('connection', function (socket) {
  socket.on('client', function(data) {
    console.log('clientserver data', data);
    client.emit('my event', data);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 


mongoose.connect('mongodb://localhost:27017/tiendapizza');

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
                    nombre: 'Margarita',
                    ing: ['TOMATE', 'MOZZARELLA', 'JAMÓN DULCE'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },

                {
                    id: 003,
                    nombre: 'Prosciutto',
                    ing: ['TOMATE', 'MOZZARELLA', 'JAMÓN DULCE'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },
                {
                    id: 004,
                    nombre: 'Margarita',
                    ing: ['TOMATE', 'MOZZARELLA', 'JAMÓN DULCE'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },
                {
                    id: 005,
                    nombre: 'Prosciutto',
                    ing: ['TOMATE', 'MOZZARELLA', 'JAMÓN DULCE'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                },
                {
                    id: 006,
                    nombre: 'Margarita',
                    ing: ['TOMATE', 'MOZZARELLA', 'JAMÓN DULCE'],
                    price: '56',
                    img:'/images/home/product1.jpg'
                }
            ];

Pizza.insertMany(pizzas)
    .then(function(mongoosePizzas) {
         /* ... */
         console.log(`Pizzas insertadas: ${mongoosePizzas.lenght}`);
    })
    .catch(function(err) {
        /* Error handling */
        console.error(err);
    });

/*var pizza = new Pizza({ id: 001,
                    nombre: 'Prosciutto',
                    ing: ["TOMATE", "MOZZARELLA", "JAMÓN DULCE"],
                    price: '56',
                    img:'/images/home/product1.jpg'});

            pizza.save(function (err, pizza) {
              if (err) return console.error(err);
              console.log('insertado!!!!');
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


/*app.get('*', function(req, res) {
  res.render('index'); // load our public/index.html file
});*/

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

/*server.listen(3000, function(){
    console.log('Servidor está funcionando en http://localhost:3000');
}); */

module.exports = app;