const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/story");
const story = require("../models/story");

// add story page

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});
// add story
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});
//  get all public stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", { stories });
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

// edit stories
router.get("/edit/:id", async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();
    if (!story) {
      res.render("errors/404");
    }
    // check owner
    if (story.user != req.user) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

// update stories

router.put("/:id", async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);
    if (!story) {
      res.render("errors/404");
    }

    // check owner
    if (story.user != req.user) {
      res.redirect("/stories");
    } else {
      story = await Story.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

// delete stories

router.delete("/:id", async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);
    if (!story) {
      res.render("errors/404");
    }
    // check owner
    if (story.user != req.user) {
      res.redirect("/stories");
    } else {
      await Story.findByIdAndDelete(req.params.id);
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

module.exports = router;
