var cryptico = require('cryptico-js');

// Frase secreta para crear repetidamente la llave RSA

var PassPhrase = "Pizzas are awesome"; 

// Tamaño de la llave RSA, en bits. 
var Bits = 1024;

var RSAkey = cryptico.generateRSAKey(PassPhrase, Bits);

var stringLlavePublica = cryptico.publicKeyString(RSAkey); 

var io = require('socket.io').listen(3013);

var nano = require('nano')('http://localhost:5984');

var transacciones;

// Se elimina la bdd en caso de existir
nano.db.destroy('transacciones', function() {
	console.log('Se eliminó la bdd existente');
  	// crea una nueva bdd
  	nano.db.create('transacciones', function() {
  		
  		console.log('Se creó la bdd');
	    // Se especifica la bdd a usar
	    transacciones = nano.use('transacciones');

	    io.sockets.on('connection', function (socket) {
		  console.log('Llegó al banco');

		  //Se comparte la clave pública al conectarse con el servidor de la página
		  socket.on('clave', function (name, fn) {
		    fn(stringLlavePublica);
		  });

		  socket.on('banco', function (data, fn) {
		    console.log('Nombre cifrado: '+data.name);
		    var resultado = cryptico.decrypt(data.name, RSAkey);
		    data.name = resultado.plaintext;
		    console.log('Nombre normal: '+data.name);
		    console.log('Apellido: '+data.lastname);
		    var aprobado = aleatorio(1,9);
		    if(aprobado < 4){
		        console.log('El random es: ' + aprobado);

		        //Insert a book document in the books database
				transacciones.insert({status: 'rechazado', nombre: data.name, apellido: data.lastname}, null, function(err, body) {
				  if (!err){
				    console.log(body);
				  }
				});

				//Get a list of all books
				transacciones.list(function(err, body){
				  console.log(body.rows);
				});

		        //se debe crear el documento con data
		        fn({"error": true, "message": "El banco rechazó el pago", "persona": "woot"});
		    }
		    else{
		        console.log('El random es: ' + aprobado);
		        transacciones.insert({status: 'aprobado', nombre: data.name, apellido: data.lastname}, null, function(err, body) {
				  if (!err){
				    console.log(body);
				  }
				});

				//Get a list of all books
				transacciones.list(function(err, body){
				  console.log(body.rows);
				});
		        //se debe crear el documento con data
		        fn({"error": false, "message": "El banco aprobó el pago", "persona": "woot"});
		    }
		  });
		});
  });
});


function aleatorio (min, max){

    var resultado;
    resultado = Math.floor(Math.random() * (max - min + 1)) + min;
    return resultado;
}