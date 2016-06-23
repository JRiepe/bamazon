// require mysql to access DB
var mysql = require('mysql');

// require prompt to prompt for item to buy
var inquirer = require('inquirer');

// open a connection to DB
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: process.argv[2],
	database: 'Bamazon'
}) // end var connection


// what to do if error
connection.connect(function(err) {
	if (err) throw err;
	console.log('connected as id'+ connection.threadId)
}); // end connection.connect(function(err)


// function selectProduct()
function selectProduct() {
		connection.query('SELECT * FROM Products', function(err, data) {
			if (err) throw err;
				console.log(data);
				console.log("The following items are for sale.")
				console.log("*********************************")
				for (prod in data) {
					console.log("Item id: "+data[prod].ItemID);
					console.log("Product Name: "+data[prod].ProductName);
					console.log("Department Name: "+data[prod].DepartmentName);
					console.log("Price: "+data[prod].Price);
					console.log("Quantity in Stock: "+data[prod].StockQuantity);
					console.log("*****************************")
				}; // end for
				inquiry();
		 }); // end connection.query('SELECT * FROM Products', function(err, data

} // end function selectProduct()


// function inquiry to prompt user for item to buy and number
function inquiry() {
			// prompt user for itemid to purchase and number of items
			inquirer.prompt([
			    {
			        type: "input",
			        message: "Enter the Item Id you would like to buy:",
			        name: "ItemID"
			    },
			    {
			        type: "input",
			        message: "How many would you like to purchase?",
			        name: "StockQuantity"
			    }
			    // after input, we then.... search DB for item 
			]).then(function (user) {
    			// If we log that user as a JSON, we can see how it looks.
	    		// console.log(JSON.stringify(user, null, 2));

	    		connection.query('SELECT * FROM Products WHERE ItemID = ?', [user.ItemID], function(err, data) {
					// if error
					if (err) throw err;
					
					// validate if item exists	
					if (data.length < 1) {
						console.log('Item '+user.ItemID+' not found. Please try again!');
						inquiry();
					}
					
					// validate if there are enough items in stock
					else if ((parseInt(data[0].StockQuantity) < parseInt(user.StockQuantity)) || (parseInt(user.StockQuantity) < 1)) {
						console.log("Insufficient Quantity... Please try again!" )
						inquiry();
					}
					
					// item exists and enough in stock
					else {
						console.log(data);	
					}
			    
			    }); // end connection.query('SELECT * FROM Products WHERE ItemID = ?', [user.ItemID], function(err, data) 
			
			}); // end inquirer.prompt

}; // end function inquiry()