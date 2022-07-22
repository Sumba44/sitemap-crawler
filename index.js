const Crawler = require("crawler");
const fs = require("fs");
const chalk = require("chalk");
const GetSitemapLinks = require("get-sitemap-links").default;

var count = 0;

// clear log file
const logFile = fs.createWriteStream("output.log", {
  flags: "w",
});

(async () => {
  const urlList = await GetSitemapLinks(
    "/sitemap.xml"
  );
  console.log("Total items in sitemap: " + urlList.length);

  const c = new Crawler({
    rateLimit: 1000, // interval in ms
    maxConnections: 1,

    // This will be called for each crawled page
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        let $ = res.$;
        count++;

        // search string <------------------------------------
        let output = res.body.includes(".icon");
        
        let outputString = String(output);

        if (outputString == "true") {
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
        if (outputString == "true") {
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

      }
      done();
    },
  });

  c.queue(urlList);

})();