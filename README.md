##Endpoints

###GET
- /api - returns welcome message 
- /api/houses - returns all houses 
- /api/house/:house_id - returns a house
- /api/house/:house_id/transactions - returns all house transactions
- /api/house/:house_id/transaction/:transaction_id - returns single house transaction
- /api/house/:house_id/users - returns all users
- /api/house/:house_id/user/:user_id - returns a user
- /api/house/:house_id/user/:user_id/transactions - returns user's transactions

###POST
- /api/house/new - creates a new house | {name}
- /api/house/:house_id/transactions/new - creates a new transaction | {name, user, amount, split}
- /api/house/:house_id/user/new - create a new user | {name}

###DELETE (for dev only)
- /api/house/:house_id - delate a house by ID
- /api/house/:house_id/user/:user_id - delete a user by ID
- /api/house/:house_id/transaction/:transaction_id - delete a transaction by ID
