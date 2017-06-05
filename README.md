# NODEPOP

## Requisitos previos

1. NodeJS versión 7.6 mínimo.
2. MongoDB
3. Postman (recomendable)

## Instancia en aws

- Accediendo por este subdominio puedes comprobar que la api de ***nodepop*** está funcionando [http://nodepop.fabiogomez.es/apiv1/anuncios?precio=%3C450&includetotal=true](http://nodepop.fabiogomez.es/apiv1/anuncios?precio=%3C450&includetotal=true), si examinas la cabecera verás que quien te responde es ***Express*** y como no te estás autenticando te responderá con un ***403***
	
		{
		"success": false,
		"result": "Unathorized"
		}
	
- Puedes comprobar que es ***Nginx*** quien sirve los estáticos directamente, por ejemplo con mi bici (la foto no es mia) [http://nodepop.fabiogomez.es/images/anuncios/bici.jpg](http://nodepop.fabiogomez.es/images/anuncios/bici.jpg) verás que la cabecera ***X-Owner*** es igual al nombre de mi usuario de github. Otro ejemplo, en la raiz del subdominio, [http://nodepop.fabiogomez.es](http://nodepop.fabiogomez.es), el html lo sirve ***Express*** y el css  ***Nginx***

	### Extras:
	- Instalado ***SSL*** en ***Nginx*** para los dominios [http://fabiogomez.es](http://fabiogomez.es) y [http://www.fabiogomez.es](http://www.fabiogomez.es), puedes visitarlos con ***http*** y también si visitas la ***ip*** de la instancia, la ip es [http://34.206.235.238/](http://34.206.235.238/), en todos los casos te redirige con un ***301*** a [**https**://www.fabiogomez.es](https://www.fabiogomez.es) y verás la plantilla de ***bootstrap***

## Instalación

1. Clonar el repo de [https://github.com/gomez-fabio/nodepop.git](https://github.com/gomez-fabio/nodepop.git)

2. Entrar al directorio nodepop desde la consola y ejecutar `npm install`, para que nos instale todas las dependencias.

3. Una vez finalizado el punto 2, debemos inicializar la base de datos, para lo que, desde la consola ejecutar `npm run installDB`, si todo es correcto, veremos en consola:

		> nodepop@0.0.0 installDB /nodepop
		
		> node ./install_db.js
		
		DB_CONN_OK
		
		Colección de anuncios inicializada correctamente.
		
		Colección de usuarios inicializada correctamente.
		
		Escribe ahora npm run start para iniciar.

4. Tenemos otras dos opciones para iniciar
	 - `npm run start`, que inicia de manera "normal".
	 - `npm run dev`, que inicia en modo debug y con nodemon, de manera que recarga con cada modificación de fichero.

## Detalles de la API

La api tiene implementada autenticación con json web token para la consulta de anuncios y tags, por lo que debemos suministrar un token para acceder a la api.

### Registro de usuarios

Disponible en [http://localhost:3000/apiv1/usuarios](http://localhost:3000/apiv1/usuarios)

Usaremos el verbo ***post*** de http, y pasaremos por el body, tres valores, nombre, email y clave (se almacena hasheada). El contenido del body en form-urlencoded. El campo email es clave única. Durante el registro se nos suministra un token, que es necesario para acceder a la api, este token tiene una validez de 15 minutos.

Ejemplo de un post correcto:

	{
	  "success": true,
	  "result": {
	    "__v": 0,
	    "nombre": "javier",
	    "email": "javier2@gmail.com",
	    "clave": "9595c9df90075148eb06860365df33584b75bff782a510c6cd4883a419833d50",
	    "_id": "5921a7c418aeea32f46b615a"
	  },
	  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTIxYTdjNDE4YWVlYTMyZjQ2YjYxNWEiLCJpYXQiOjE0OTUzNzc4NjAsImV4cCI6MTQ5NTM3ODc2MH0.nv47JyVySjKiVX2ECaptXs1J_aS9_DqXgT0lC38WNQM"
	}
	
Ejemplo de un post con el mail repetido:

	{
	  "success": false,
	   "error": "E11000 duplicate key error collection: nodepop.usuarios index: email_1 dup key: { : \"javier2@gmail.com\" }"
	}
### Autenticación

Disponible en [http://localhost:3000/apiv1/usuarios/authenticate](http://localhost:3000/apiv1/usuarios/authenticate).

Cuando nuestro token haya expirado, para renovarlo utilizaremos éste método, los tokens, de nuevo, tienen una validez de 15 minutos.

Usaremos el verbo ***post*** de http, y pasaremos por el body, dos valores, email y clave (previamente nos debemos haber registrado como usuarios con el método del punto anterior). El contenido del body en form-urlencoded

Ejemplo de un post correcto:
	
	{
	  "success": true,
	  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTIxYTdjNDE4YWVlYTMyZjQ2YjYxNWEiLCJpYXQiOjE0OTUzNzk0MzIsImV4cCI6MTQ5NTM4MDMzMn0.SLAlqxdNyDahEaZRu9Af7qBJ0WIda1Vmu25C69HL7KA"
	}

Ejemplo de un get incorrecto:
	
	Unauthorized

### Lista de tags existentes

Disponible en [http://localhost:3000/apiv1/anuncios/tags](http://localhost:3000/apiv1/anuncios/tags)

Usaremos el verbo ***get*** de http, y es necesaria la autenticación con un token válido. En la cabecera de la petición debemos incluir una `clave` token con el valor de un token válido.

Ejemplo de un get correcto:

	{
	  "success": true,
	  "result": [
	    "lifestyle",
	    "mobile",
	    "motor",
	    "work"
	  ]
	}

Ejemplo de get sin autorizar

	{
	  "success": false,
	  "result": "Unathorized"
	}

### Lista de anuncios

Disponible en [http://localhost:3000/apiv1/anuncios](http://localhost:3000/apiv1/anuncios)

Usaremos el verbo ***get*** de http, y es necesaria autenticación, de nuevo, en la cabecera de la petición debemos incluir una `clave` token con el valor de un token válido. Si usamos postman, podremos clicar en los enlaces de la foto, y nos abrirá la imagen, los recursos de imágenes están en abierto en la carpeta public, por lo que no es necesaria autenticación.

Ejemplo de un get correcto:
	
	{
	  "success": true,
	  "result": [
	    {
	      "nombre": "Bicicleta",
	      "venta": true,
	      "precio": 230.15,
	      "foto": "/images/anuncios/bici.jpg",
	      "tags": [
	        "lifestyle"
	      ]
	    },
	    {
	      "nombre": "iPhone",
	      "venta": false,
	      "precio": 50,
	      "foto": "/images/anuncios/iphone.png",
	      "tags": [
	        "lifestyle",
	        "mobile"
	      ]
	    },
	    {
	      "nombre": "Moto",
	      "venta": true,
	      "precio": 4500,
	      "foto": "/images/anuncios/moto.jpg",
	      "tags": [
	        "motor"
	      ]
	    },
	    {
	      "nombre": "Impresora Multifunción",
	      "venta": true,
	      "precio": 850,
	      "foto": "/images/anuncios/impresora.jpg",
	      "tags": [
	        "work"
	      ]
	    }
	  ]
	}
	
Ejemplo de get sin autorizar

	{
	  "success": false,
	  "result": "Unathorized"
	}

ejemplo de un get con un token expirado

	{
	  "success": false,
	  "error": "Token expired"
	}
	
### Lista de anuncios filtrada

Sobre la lista de anuncios se pueden aplicar filtros, pasados como query string, los disponibles son sobre los campos

- Nombre : [http://localhost:3000/apiv1/anuncios?nombre=ip](http://localhost:3000/apiv1/anuncios?nombre=ip) (Esto buscará lo que comience por *ip*. No es case sensitive).
- Venta  : [http://localhost:3000/apiv1/anuncios?venta=true](http://localhost:3000/apiv1/anuncios?venta=true) (Esto buscará lo que esté en venta. Los valores posible son true y false. No es case sensitive)
- Precio : Podemos buscar de varias formas,
	- Precio exacto: [http://localhost:3000/apiv1/anuncios?precio=4500](http://localhost:3000/apiv1/anuncios?precio=4500)
	- Precio menor o igual que: [http://localhost:3000/apiv1/anuncios?precio=<4500](http://localhost:3000/apiv1/anuncios?precio=<4500)
	- Precio mayor o igual que: [http://localhost:3000/apiv1/anuncios?precio=>850](http://localhost:3000/apiv1/anuncios?precio=>850)
	- Precio por rangos: [http://localhost:3000/apiv1/anuncios?precio=>850-<1000](http://localhost:3000/apiv1/anuncios?precio=>850-<1000)
- Tags   : [http://localhost:3000/apiv1/anuncios?tags=mobile,WORK](http://localhost:3000/apiv1/anuncios?tags=mobile,WORK) (Podemos buscar por uno o varios tags, separados por comas. No es case sensitive)

Finalmente podemos combinar los diferentes filtros
[http://localhost:3000/apiv1/anuncios?tags=mobile,lifestyle&precio=>50-<300&venta=false&nombre=iph](http://localhost:3000/apiv1/anuncios?tags=mobile,lifestyle&precio=>50-<300&venta=false&nombre=iph)

Podemos aplicar parametros adicionales en el query string,

- limit : [http://localhost:3000/apiv1/anuncios?limit=n](http://localhost:3000/apiv1/anuncios?limit=n) (siendo n un número entero que permite devolver sólo los n primeros de la lista)
- skip  : [http://localhost:3000/apiv1/anuncios?skip=n](http://localhost:3000/apiv1/anuncios?skip=n) (siendo n un número entero que permite saltar los n primeros de la lista)
- sort  : [http://localhost:3000/apiv1/anuncios?sort=precio](http://localhost:3000/apiv1/anuncios?sort=precio) (nos permite ordenar por cualquier campo de manera ascendente) o [http://localhost:3000/apiv1/anuncios?sort=-precio](http://localhost:3000/apiv1/anuncios?sort=-precio) (de manera descendente)
- includetotal : [http://localhost:3000/apiv1/anuncios?includetotal=true](http://localhost:3000/apiv1/anuncios?includetotal=true) Si incluimos este parámetro con valor a `true`, nos devolverá el numero de registros que estamos filtrando por `querystring`, ojo, no el total de la db. Se puede combinar con el resto de parametros y filtros, por ejemplo [http://localhost:3000/apiv1/anuncios?tags=lifestyle,work&precio>500&includetotal=true&sort=precio&skip=1](http://localhost:3000/apiv1/anuncios?tags=lifestyle,work&precio>500&includetotal=true&sort=precio&skip=1) Al incluir este parámetro, la salida del get incluye el total, como en este ejemplo,

		{
		  "success": true,
		  "total": 2,
		  "result": [
		    {
		      "nombre": "Bicicleta",
		      "venta": true,
		      "precio": 230.15,
		      "foto": "/images/anuncios/bici.jpg",
		      "tags": [
		        "lifestyle"
		      ]
		    },
		    {
		      "nombre": "Impresora Multifunción",
		      "venta": true,
		      "precio": 850,
		      "foto": "/images/anuncios/impresora.jpg",
		      "tags": [
		        "work"
		      ]
		    }
		  ]
		}