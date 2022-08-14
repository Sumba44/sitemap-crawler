const Crawler = require("crawler");
const fs = require("fs");
const chalk = require("chalk");
const GetSitemapLinks = require("get-sitemap-links").default;

var count = 0;

// clear log file
const logFile = fs.createWriteStream("output.json", {
  flags: "w",
});

(async () => {
  const c = new Crawler({
    rateLimit: 1000, // interval in ms
    maxConnections: 1,

    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        count++;
        var $ = res.$;

        let results = $(".card");

        let arr = []

        for (let i = 0; i < results.length; i++) {

            let obj = {
                "id": i.toString(),
                "title": $(".card").eq(i).find(".card-title").text(),
                "category": "0",
                "type": "blog",
                "date": $(".card").eq(i).find(".card-text small").text(),
                "url": $(".card").eq(i).find("a").attr("href"),
                "img": $(".card").eq(i).find("img").attr("src"),
                "perex": $(".card").eq(i).find(".card-text").text(),
            }

            JSON.stringify(obj);
            arr.push(obj)

            JSON.stringify(arr);
            
        }

        // logFile.write(arr);

        console.log(JSON.stringify(arr));

        
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        // console.log($(".card-title").text());

        // search string <------------------------------------
        // let output = res.body.includes(".icon");

        // let outputString = String(output);

        // if (outputString == "true") {
        //   logFile.write(
        //     outputString +
        //       " || " +
        //       count +
        //       "/" +
        //       urlList.length +
        //       " || " +
        //       res.options.uri +
        //       "\r\n"
        //   );
        // }

        // let outputRender;
        // if (outputString == "true") {
        //   outputRender = chalk.green(outputString);
        // } else {
        //   outputRender = chalk.gray(outputString);
        // }

        // // Log the output
        // console.log(
        //   outputRender + "\t",
        //   chalk.blue(count) +
        //     chalk.gray("/") +
        //     chalk.blueBright(urlList.length) +
        //     "\t",
        //   chalk.yellow(res.options.uri)
        // );
      }
      done();
    },
  });

  c.queue(["https://www.csob.sk/blog"]);
})();
