# pizza
Tienda de pizzas online con envío y cifrado de información entre servidores, con MEAN stack, socket.io, cryptico-js y nano.

# Instalación

Instalar todas las dependencias con `npm install`

Iniciar el servidor de MongoDB ejecutando el comando `mongod`

Luego ir a la ruta `Banco`, instalar las dependencias con `npm install` y hacer `node banco.js`

Por último, hacer `npm start` desde el directorio `Pizza`

# Caracteristicas

Al momento de establacer la conexión entre servidores con socket.io, se comparte una llave pública desde el servidor del banco para cifrar la información. 
Cada vez que se realice una compra desde el checkout se encripta la información en el servidor mediante el algoritmo RSA usando la libreria `cryptico-js`.
El pago es aprobado o rechazado en base a un número aleatorio, y esta información se guarda en una base de dato con `nano`.
