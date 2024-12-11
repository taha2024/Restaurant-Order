
const express = require('express');
const app = express();
const fs = require('fs');
let restaurants = [];
let nextID = 0;

//Set view engine to pug
app.set("view engine", "pug");

//Get request routes
app.get("/", homePage);
app.get("/restaurants", restaurantsPage);
app.get("/addrestaurant", addRestaurant);
app.get("/js/add_client.js", sendAddJs);
app.get("/restaurants/:restID", individual_res, individual_res_html);
app.get("/restaurants/js/res_client.js", sendResJs);

//Post request routes
app.post("/restaurants", express.json(), newRestaurant);

//Put request routes
app.put("/restaurants/:restID", express.json(), updateRestaurant);

//Starts server
function startServer() {
	app.listen(3000);
	console.log("Server listening at http://localhost:3000");
}

//Reads restaurants and makes sure the information is stored in server before starting the server
function readRestaurants() {
	//Read restaurants directory 
	fs.readdir("./restaurants", function(err, files) {
		if (err) { return; }
		
		let count = 0;
		//Reads all files in restaurants directory and stores it in server 
		for (let i=0; i<files.length; i++) {
			fs.readFile("./restaurants/"+files[i], function(err, data) {
				if (err) { return; }
				
				restaurants.push(JSON.parse(data));
				count++;
				nextID++
				
				if (count === files.length) { startServer() }
			});
		}
	});
}

//Render home page
function homePage(req, res, next) {
	res.render("index");
}

//Sends either html or json infomation based on the request content type
function restaurantsPage(req, res, next) {
	res.format({
		"text/html" : function() { res.render("restaurants", {restaurants}); },
		"application/json" : function() { res.json({'restaurants': restaurants.map(function(restaurant) {return restaurant.id;})}); }
	});
}

//Render add restaurant page
function addRestaurant(req, res, next) {
	res.render("addrestaurant");
}

//Sends client javascript file
function sendAddJs(req, res, next) {
	fs.readFile("js/add_client.js", function(err, data) {
		if (err) {
			res.status(404).send("Resource Not Found");
			return;
		}
		res.statusCode = 200;
		res.end(data);
		return;
	});
}

//Adds new restaurant to server and redirects client to new restaurant page
function newRestaurant(req, res, next) {
	let info = req.body;
	if (info.name.length===0 || info.delivery_fee.length===0 || info.min_order.length===0) {
		res.status(404);
		return;
	}
	
	let new_res = {id: nextID, name: info.name, min_order: info.min_order, delivery_fee: info.delivery_fee,  menu: {}};
	restaurants[nextID] = new_res;
	nextID++;
	res.status(200).send("http://localhost:3000/restaurants/" + new_res.id);
}

//Loads individual restaurant page by calling next route handler or sends the json representation if asked
function individual_res(req, res, next) {
	if (parseInt(req.params.restID) >= restaurants.length) { 
		res.status(404).send("Resource Not Found");
	} else {		
		res.format({
			"application/json" : function() {
				res.json(restaurants.filter(function(restaurant) {
					if (restaurant.id == req.params.restID) {return restaurant;}
				})[0]); 
			},
			"text/html" : function() {next()}
		});
		
	}
}

//Render individual restaurant page
function individual_res_html(req, res, next) {
	res.render("individual_res", restaurants.filter(function(restaurant) {if (restaurant.id == req.params.restID) {return restaurant;}})[0]);
}

//Send client javascript for restaurant page
function sendResJs(req, res, next) {
	fs.readFile("js/res_client.js", function(err, data) {
		if (err) {
			res.status(404).send("Resource Not Found");
			return;
		}
		res.statusCode = 200;
		res.end(data);
		return;
	});
}

//Update restaurant information on server
function updateRestaurant(req, res, next) {
	for (let i=0; i<restaurants.length; i++) {
		if (restaurants[i].id == req.params.restID) {
			restaurants[i] = req.body;
			res.status(200).send();
			return;
		}
	}
	
	res.status(404).send("Resource Not Found");
}

readRestaurants();
