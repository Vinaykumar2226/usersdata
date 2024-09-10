Fetches all the users data<br/>
https://usersdata-4osl.onrender.com/users<br/>

fetches data based on comma separated ids (account_id) and cols specified<br/>
if a nested field is required, use '.' to nest through the data<br/>
if theres is a '*' at the end of the column name, it will be ignored<br/>
https://usersdata-4osl.onrender.com/users<br/>
ex:<br/>
http://usersdata-4osl.onrender.com/users?ids=2000,2001&cols=id,account_id,name,conditions.rules,conditions.contact_profile_rules,creator.first_name,creator.last_name,updated_by*,conditions.metadata.demographic<br/>

fetches all the unique account id<br/>
https://usersdata-4osl.onrender.com/unique-account-ids<br/>

fetches data based on comma seperated ids and cols specified, cols are flattened while sending back<br/>
ex:<br/>
http://usersdata-4osl.onrender.com/users-specific?ids=1425,1426&cols=conditions__metadata__demographic,account_id,id<br/>

fetches all the unique columns(keys) in data and if nested objects found returns the column(key) by adding suffix('*')<br/>
https://usersdata-4osl.onrender.com/unique-keys
