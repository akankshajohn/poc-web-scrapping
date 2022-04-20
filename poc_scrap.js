const express = require('express');

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");


const app = express()

async function scrapeData(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const listItems = $(".latest-stories ul li");
      const stories = [];
      listItems.each((idx, el) => {
        const story = {title: "" , link:""};
        story.link = $(el).children("a").attr("href");
        story.link = url + story.link;
        story.title = $(el).children("a").children("h3").text();
        console.log("stories:", story);
        stories.push(story);
      });
      return stories;
     } catch (err) {
      console.error(err);
    }
  }

app.get('/get_stories', async function (req, res) {
    const url = "https://time.com";

    console.log("URL::", url);
    let dt = await scrapeData(url);
  res.status(200).json({data: dt});
})

app.listen(3000)