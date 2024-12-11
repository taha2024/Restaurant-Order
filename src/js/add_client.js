
//Sends post request to /restaurants to send new restaurant info and redirects to new page if successful
function sendInfo() {
	let info = {name: "", delivery_fee: "", min_order: ""};
	
	info.name = document.getElementById("resName").value;
	info.delivery_fee = document.getElementById("resDelivery").value;
	info.min_order = document.getElementById("resMinimum").value;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			window.location.href = this.responseText;
		}
	}
	req.open("POST", "http://localhost:3000/restaurants");
	req.setRequestHeader("Content-type", "application/json");
	req.send(JSON.stringify(info));
}