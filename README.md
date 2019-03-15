# README #

### How do I set up? ###

* Create DB
* Set database configuration in .env
* Run localhost:3000/sync (script to create table with one user)
* Any question, please sent me an email to vilchis40@gmail.com

1) ### Create user endpoint ###

* Create user endpoint for add, update and delete user. (Changed should be reflected in the DB)
  * Add: public, no require Authentication. Use POST method
  * Update: private, requires Authentication. Use PUT method
  * Delete: private, requires Authentication. Use DELETE method
  * Get: private, requires Authentication. Use GET method
* Each endpoint must validate data type. (ex: validate email. If is not valid, return code error with error description).
  * Ready
* Implement jwt Auth. For login, the user should call to /login and use his name and email as credentials.
  * /login method requires sent data by POST
* Only users logged in should be able to edit their data.
  * Ready

2) ### Create a query to get sales by year and month from this table ###

| id  | provider_id | client_id  | price | created             |
| --- |:-----------:| ----------:| -----:| -------------------:|
|  1  | 3049        |   493      | $1600 | 2018-09-12 10:32:13 |
|  2  | 3495        |   540      | $1200 | 2018-09-16 11:32:27 |
|  3  | 5444        |   493      | $1000 | 2018-10-14 13:32:16 |
|  4  | 3049        |   493      | $1400 | 2018-10-12 10:32:13 |
|  5  | 3495        |   540      | $1650 | 2018-10-16 11:32:27 |
|  6  | 5444        |   124      | $1100 | 2019-01-14 13:32:16 |
|  7  | 3495        |   453      | $1900 | 2019-02-16 11:32:27 |
|  8  | 5444        |   123      | $900  | 2019-03-14 13:32:16 |


Ouput example:

| year | month | reservation | total |
| ---  |:-----:| -----------:| -----:|
| 2018 |  09   |   2         | $2800 |
| 2018 |  10   |   3         | $4050 |
| 2019 |  01   |   1         | $1100 |
| 2019 |  02   |   1         | $1900 |
| 2019 |  03   |   1         | $900  |

Query:
```sql
SELECT
  year(created) as year,
  month(created) as month,
  count(*) as reservation,
  sum(price) as total
FROM sales group by year(created), month(created)
```

Query with format in months and total:
```sql
SELECT
  year(created) as year,
  LPAD(month(created), 2, '0') as month,
  count(*) as reservation,
  CONCAT('$',CAST(sum(price) AS CHAR)) as total
FROM sales
group by year(created), month(created)
```



3) ### What are the differences between? ###

```throw new Error('something bad happened');```
  Here the error becomes an exception (and it is throw). Synchronous way.

```callback(new Error('something bad happened'));```
  Here the error is created without throwing it. The callback function is responsible for executing the error. This is the more common way to use in Node.js because most error are asynchronous
