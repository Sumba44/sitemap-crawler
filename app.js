const Crawler = require("crawler");
const fs = require("fs");
const chalk = require("chalk");
const GetSitemapLinks = require("get-sitemap-links").default;

var count = 0;

// clear log file
const logFile = fs.createWriteStream("output.log", {
  flags: "w",
});

// import array of URLs
// const urlList = require("./list.js");

(async () => {
  // Add sitemap URL
  const urlList = await GetSitemapLinks(
    "/sitemap.xml"
  );
  console.log("Total items in sitemap: " + urlList.length);

  const c = new Crawler({
    rateLimit: 500, // interval in ms
    maxConnections: 1,

    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        let $ = res.$;
        count++;

        // Return True if find STRING
        // let output = res.body.includes('latobná karta ');
        let output3 = false;
        if (
          (res.body.match(new RegExp("latobná karta", "g")) || []).length > 3
        ) {
          output3 = true;
          console.log("hmmmm true?", (res.body.match(new RegExp("latobná karta", "g")) || []).length);
        } else {
          output3 = false;
        }

        // let output4 = res.body.includes('latobná karta.');
        let outputString = String(output3);

        if (output3 == true) {
          logFile.write(
            outputString +
              " || " +
              count +
              "/" +
              urlList.length +
              " || " +
              res.options.uri +
              "\r\n"
          );
        }

        let outputRender;
        if (output3 == true) {
          outputRender = chalk.green(outputString);
        } else {
          outputRender = chalk.gray(outputString);
        }

        // Log the output
        console.log(
          outputRender + "\t",
          chalk.blue(count) +
            chalk.gray("/") +
            chalk.blueBright(urlList.length) +
            "\t",
          chalk.yellow(res.options.uri)
        );

        // Return True if find STRING
        // console.log(res.options.uri, res.body.includes(".pos-item"));

        // show URL of the scraped page
        // console.log(res.options.uri);

        // Show array of scraped items based on selector
        // let arr = [];
        // arr.push($(".icon").text());
        // console.log(arr);

        // Print inner text of all matched elements
        // console.log($("h3").text());
      }
      done();
    },
  });

  c.queue(urlList);

  // c.queue([
  //   "https://www.asd.sk/platobne-terminaly",
  //   "https://www.asd.sk/klienti",
  //   "https://www.asd.sk/bankovnictvo",
  //   "https://www.asd.sk/platby"
  // ]);
})();
