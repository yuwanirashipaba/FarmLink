const router = require("express").Router();
const Feedback = require("../models/feedback");

// Get accepted feedbacks
router.route("/accepted-feedbacks").get(async (req, res) => {
    try {
        const acceptedFeedbacks = await Feedback.find({ status: 'Accepted' });
        res.json(acceptedFeedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching accepted feedbacks" });
    }
});

module.exports = router;
