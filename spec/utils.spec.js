const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returned object has different reference to  and not mutated", () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input);
    expect(formatDates(input)).to.eql([]);
  });
  it("return empty array when given empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("return array w one object w converted timestamp", () => {
    expect(
      formatDates([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ]);
  });
  it("return array w multiple objects w converted timestamp", () => {
    expect(
      formatDates([
        {
          title: "Running a Node App",
          topic: "coding",
          author: "jessjelly",
          body:
            "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          created_at: 1471522072389
        },
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.eql([
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: new Date(1471522072389)
      },
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("returned object has different reference to  and not mutated", () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input);
    expect(formatDates(input)).to.eql([]);
  });
  it("return empty array when given empty array ", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("return array w one object made into refOb when given array w one obj", () => {
    expect(makeRefObj([{ article_id: 1, title: "A" }])).to.eql({ A: 1 });
  });
  it("return array w multiple object made into refOb when given array w multiple obj", () => {
    expect(
      makeRefObj([
        { article_id: 1, title: "A" },
        { article_id: 2, title: "B" }
      ])
    ).to.eql({ A: 1, B: 2 });
  });
});

describe("formatComments", () => {
  it("returned object has different reference to  and not mutated", () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input);
    expect(formatDates(input)).to.eql([]);
  });
  it("return empty array when given empty array ", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("return one (object) formatted comment in array ", () => {
    const refObj = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 968
    };
    expect(
      formatComments(
        [
          {
            body:
              "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
            belongs_to:
              "The People Tracking Every Touch, Pass And Tackle in the World Cup",
            created_by: "tickle122",
            votes: -1,
            created_at: 1468087638932
          }
        ],
        refObj
      )
    ).to.eql([
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 968,
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      }
    ]);
  });
  it("return multiple (objects) formatted comments in array ", () => {
    const refObj = {
      "Sunday league football": 967,
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 968
    };
    expect(
      formatComments(
        [
          {
            body:
              "Iure cum non veritatis dolore corrupti deserunt perferendis molestiae. Voluptatem ullam qui aut voluptatem. Magnam quo ut rem nobis quibusdam. Assumenda ex laboriosam ut ea explicabo.",
            belongs_to: "Sunday league football",
            created_by: "happyamy2016",
            votes: 2,
            created_at: 1501187675733
          },
          {
            body:
              "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
            belongs_to:
              "The People Tracking Every Touch, Pass And Tackle in the World Cup",
            created_by: "tickle122",
            votes: -1,
            created_at: 1468087638932
          }
        ],
        refObj
      )
    ).to.eql([
      {
        body:
          "Iure cum non veritatis dolore corrupti deserunt perferendis molestiae. Voluptatem ullam qui aut voluptatem. Magnam quo ut rem nobis quibusdam. Assumenda ex laboriosam ut ea explicabo.",
        article_id: 967,
        author: "happyamy2016",
        votes: 2,
        created_at: new Date(1501187675733)
      },
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 968,
        author: "tickle122",
        votes: -1,
        created_at: new Date(1468087638932)
      }
    ]);
  });
});
