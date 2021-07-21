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
    "https://www.csob.sk/delegate/sitemap.xml"
  );
  console.log("Total items in sitemap: " + urlList.length);

  const c = new Crawler({
    rateLimit: 3000, // interval in ms
    maxConnections: 1,

    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        let $ = res.$;
        count++;

        // Return True if find STRING
        let output = res.body.includes(".icon");
        let outputString = String(output);

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

        let outputRender;
        if (outputString === "true") {
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
  //   "https://www.csob.sk/podnikatelia-firmy/platobne-terminaly",
  //   "https://www.csob.sk/individualni-klienti",
  //   "https://www.csob.sk/privatne-bankovnictvo",
  //   "https://www.csob.sk/ucty-a-platby"
  // ]);
})();
