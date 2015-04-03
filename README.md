##Endpoints

GET
/api - returns welcome message [done]
/api/houses - returns list of all houses [done]
/api/house/:house_id - returns house [done]
/api/house/:house_id/transactions - returns house transactions [done]
/api/house/:house_id/transaction/:transaction_id - returns transaction by ID [done]
/api/house/:house_id/user/:user_id/transactions - returns only that user's transactions [done]


POST 
/api/house/ - create a new house [done]
/api/house/:house_id/transactions/new - creates a new transaction [done]
/api/house/:house_id/user/new - create a new user [done]


DELETE
/api/house/:house_id - delate a house by ID [done]
/api/house/:house_id/user/:user_id - delete a user by ID [done]
/api/house/:house_id/transaction/:transaction_id - delete a transaction by ID [done]
