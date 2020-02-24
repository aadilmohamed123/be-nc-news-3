process.env.NODE_ENV = "test";
const connection = require("../connection");
const app = require("../app");

const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

chai.use(require("sams-chai-sorted"));

after(() => {
  return connection.destroy();
});
beforeEach(() => {
  return connection.seed.run();
});

describe("/", () => {
  it("GET - 404 - Route Not Found", () => {
    return request(app)
      .get("/HIII")
      .expect(404)
      .then(response => {
        expect(response.error.text).to.equal("Route Not Found");
      });
  });
  describe("/api", () => {
    describe("/comments", () => {
      //not asked for
      it(" GET - 200 - responds with an array of comments objects", () => {
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then(response => {
            const comments = response.body.comments;
            expect(comments).to.be.an("array");
            expect(comments[0]).to.have.keys(
              "comment_id",
              "author",
              "body",
              "created_at",
              "votes",
              "article_id"
            );
          });
      });
      describe("/:comment_id", () => {
        it("PATCH - 200 - responds w updated comment", () => {
          return request(app)
            .patch("/api/comments/7")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(response => {
              expect(response.body.comment.votes).to.equal(10);
            });
        });
        it("PATCH - 400 - Invalid Input For Integer", () => {
          return request(app)
            .patch("/api/comments/7")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(response => {
              console.log(response.body);
              expect(response.body.msg).to.equal("Invalid Input For Integer");
            });
        });
        it("PATCH - 200 - Missing inc_votes key - defaults to incrementing by 0", () => {
          return request(app)
            .patch("/api/comments/7")
            .send({ hello: "hello" })
            .expect(200)
            .then(response => {
              expect(response.body.comment.votes).to.equal(0);
            });
        });
      });

      it("DELETE - 204 - no content", () => {
        return request(app)
          .del("/api/comments/7")
          .expect(204);
      });
      it("DELETE - 404 - Not Found", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(response => {
            // console.log(response);
            expect(response.body.msg).to.equal("Not Found");
          });
      });
    });

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

    describe("/users", () => {
      //not asked for
      it("responds with an array of users objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(response => {
            const users = response.body.users;
            expect(users).to.be.an("array");
            expect(users[0]).to.have.keys("name", "username", "avatar_url");
          });
      });
      describe(":username", () => {
        it("GET returns status 200 and requested username object", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.have.keys("username", "avatar_url", "name");
            });
        });
        it("GET - 404 - Not Found", () => {
          return request(app)
            .get("/api/users/margarine_walkway")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Not Found");
            });
        });
      });
    });

    describe.only("/articles", () => {
      it("responds with an array of articles objects", async () => {
        const response = await request(app)
          .get("/api/articles")
          .expect(200);
        const articles = response.body.articles;
        expect(articles).to.be.an("array");
        expect(articles[0]).to.include.keys(
          "title",
          "topic",
          "author",
          "body",
          "created_at",
          "votes",
          "article_id"
        );
      });
      it("GET - 404 - sort by author not exist", async () => {
        const response = await request(app)
          .get("/api/articles?sort_by=userjk")
          .expect(400);
        expect(response.body.msg).to.equal("Column Does Not Exist");
      });

      it("GET returns requested articles objects w comment count", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).to.include.keys("comment_count");
          });
      });

      it("GET - 200 - Responds with an array of articles objects sorted by created_at by default && ordered by desc by default ", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(articles =>
            expect(articles.body.articles).to.be.sortedBy("created_at", {
              descending: true
            })
          );
      });

      it("GET - 200 - Responds with an array of articles objects sorted by votes && ordered by asc ", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(articles =>
            expect(articles.body.articles).to.be.sortedBy("votes")
          );
      });

      describe("/:article_id", () => {
        it("PATCH - 200 - responds w updated article", () => {
          return request(app)
            .patch("/api/articles/7")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(response => {
              expect(response.body.patchedArticle.votes).to.equal(10);
            });
        });

        it("GET returns status 200 and requested article object", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.include.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes"
              );
            });
        });

        it("GET returns requested article object w comment count", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.include.keys("comment_count");
            });
        });

        describe("/comments", () => {
          it("GET returns status 200 and an array of comments for the requested article id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response => {
                const comments = response.body.comments;
                expect(comments).to.be.an("array");
                expect(comments[0]).to.have.keys(
                  "comment_id",
                  "author",
                  "body",
                  "created_at",
                  "votes",
                  "article_id"
                );
              });
          });
          it("GET - 404 - article id not found", () => {
            return request(app)
              .get("/api/articles/1234567890/comments")
              .expect(404)
              .then(response => {
                expect(response.body.msg).to.equal("Not Found");
              });
          });

          it("POST - 201 - Responds with 201 when given a new comment", () => {
            return request(app)
              .post("/api/articles/2/comments")
              .expect(201)
              .send({
                body: "Oh,  the asdfghjkl!",

                created_by: "butter_bridge"
              })
              .then(response => {
                expect(response.body.comment).to.contain.keys(
                  "username",
                  "body"
                );
              });
          });
        });
      });
    });
  });
});
