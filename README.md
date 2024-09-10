Fetches all the users data<br/>
https://usersdata-4osl.onrender.com/users<br/>

fetches data based on comma separated account_id and cols specified<br/>
https://usersdata-4osl.onrender.com/users/:account_ids<br/>
ex:<br/>
https://usersdata-4osl.onrender.com/users/1425,1426?cols=account_id,href,id<br/>

fetches all the unique account id<br/>
https://usersdata-4osl.onrender.com/unique-account-ids<br/>

fetches data based on comma seperated ids and cols specified, cols are flattened while sending back<br/>
ex:<br/>
http://usersdata-4osl.onrender.com/users-specific?ids=1425,1426&cols=conditions__metadata__demographic,account_id,id<br/>
