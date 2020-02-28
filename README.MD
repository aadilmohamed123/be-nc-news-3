# NC-News-Back-End

back-end for a news aggregator website


### Installing


```
npm i

npm setup-dbs

npm run seed
```


## Running the tests

Explain how to run the automated tests for this system

```
npm t
```

Test the utiliy functions

```
npm run test-utils
```

### Break down into end to end tests

Checks status code and response object when grequested a particular url

```
describe("/topics", () => {
      it("responds with an array of topics objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            const topics = response.body.topics;
            expect(topics).to.be.an("array");
            expect(topics[0]).to.have.keys("description", "slug");
          });
      });
    });
```



## Built With

* [Express](https://expressjs.com/) - unopiniated web framework
* [Knex](http://knexjs.org/) - SQL query builder
* [node-postgres](https://node-postgres.com/) - node modules to interact with a PostgreSQL database

## Tested With

* [Mocha](https://mochajs.org/) - test framework
* [Chai](https://www.chaijs.com/guide/) - assertion library
* [Supertest](https://www.npmjs.com/package/supertest) - HTTP assertions
* [Nodemon](https://www.npmjs.com/package/nodemon) - restart node whilst editing
* [Sams-chai-sorted](https://www.npmjs.com/package/sams-chai-sorted) - test sorted values


## Authors

* **Aadil Mohamed** - [My GitHub](https://github.com/aadilmohamed123)



