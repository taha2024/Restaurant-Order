let restaurant;
let next_ID = 0;

//Gets restaurant info 
function init() {
	let source = window.location.href;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			restaurant = JSON.parse(this.responseText);
			
			//Sets value for the next menu item id
			for (key in restaurant.menu) {
				for(more_key in restaurant.menu[key]) {
					next_ID = parseInt(more_key)+1;
					
				}
			}
		}
	}
	
	req.open("GET", source);
	req.setRequestHeader("Content-type", "application/json");
	req.send();
}

//Updates restaurant name, delivery fee and minimum order
function restaurant_info() {
	restaurant.name = document.getElementById("resName").value;
	restaurant.delivery_fee = document.getElementById("resDelivery").value;
	restaurant.min_order = document.getElementById("resMinimum").value;
}

//Adds new cateogry to restaurant
function addCategory() {
	let new_category = document.getElementById("addCategory").value;
	
	if (new_category in restaurant.menu) {
		alert("That Category Already Exists!");
	}
	
	restaurant.menu[new_category] = {};
	document.getElementById("menu").innerHTML += "<div id=" + new_category + "><p style='font-size:20px'>" + new_category + ":</p></div></br></br>";
	let category_option = document.createElement("option");
	category_option.value = new_category;
	category_option.text = new_category;
	document.getElementById("category_list").add(category_option);
}

//Adds new item to restaurant menu
function addItem() {
	let category = document.getElementById("category_list").value;
	let name = document.getElementById("new_item_name").value;
	let description = document.getElementById("new_item_description").value;
	let price = document.getElementById("new_item_price").value;
	
	restaurant.menu[category] = {next_ID: {name: name, description: description, price: parseInt(price)}};
	
	
	let category_div = document.getElementById(category);
	category_div.innerHTML += "ID: " + next_ID + ", " + name + "</br>" + description + "</br>Price: " + parseInt(price).toFixed(2) + "</br></br>";
	
	next_ID++;
	
}

//Sends restaurant info to server to update the information 
function saveRestaurant() {
	let source = window.location.href;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			alert("Restaurant Successfully Updated!");
		}
	}
	
	req.open("PUT", source);
	req.setRequestHeader("Content-type", "application/json");
	req.send(JSON.stringify(restaurant));
}



