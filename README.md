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



##new Endpoints

###GET
- /api/tabs - List all tabs
- /api/tab/:tab_id - List specific tab
- /api/users - List all users
- /api/user/:user_id - list specific user


##POST
- /api/tabs/new - Create a new tab {name, user_id}
- /api/users/new - Create a new user {name, email, password}
- /api/clean - Clean a user {user_id}

##delete
- /api/tab/:tab_id - delete a tab
- /api/user/:user_id - delete a user

