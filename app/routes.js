// grab the nerd model we just created
var Pizza = require('./models/pizzas');

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/api/pizzas', function(req, res) {

            /*var pizza = new Pizza({ id: 001,
                    nombre: 'Prosciutto',
                    ing: ["TOMATE", "MOZZARELLA", "JAMÓN DULCE"],
                    price: '56',
                    img:'/images/home/product1.jpg'});

            pizza.save(function (err, pizza) {
              if (err) return console.error(err);
              console.log('insertado!!!!');
            });*/

            // use mongoose to get all nerds in the database
            Pizza.find(function(err, pizzas) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                console.log(pizzas);
                res.json(pizzas); // return all nerds in JSON format
            });
            /*pizzas = [ 
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

            console.log(pizzas);
            res.send(pizzas);*/

        });

        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendFile('../views/index.ejs'); // load our public/index.html file
        });

    };