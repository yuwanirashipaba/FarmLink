const router = require("express").Router();
const Feedback = require("../models/feedback");

// Add feedback
router.route("/add").post((req, res) => {
    const { name, email, message, starRating } = req.body;

    const newFeedback = new Feedback({
        name,
        email,
        message,
        starRating
    });

    newFeedback.save()
        .then(() => {
            res.json("Feedback Added");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred while adding feedback" });
        });
});

// Get all feedback
router.route("/").get((req, res) => {
    Feedback.find()
        .then((feedbacks) => {
            res.json(feedbacks);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred while fetching feedback" });
        });
});

// Update feedback
router.put('/accept/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status: 'Accepted' }, { new: true });

        if (!feedback) {
            return res.status(404).send({ error: 'Feedback not found' });
        }

        res.send(feedback);

        
        
    } catch (error) {
        res.status(400).send(error);
    }
});

router.route("/update/:id").put(async (req, res) => {
    const { name, email, message, starRating } = req.body;
    const userId = req.params.id;

    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(userId, { name, email, message, starRating }, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }
        res.json({ status: "Feedback updated", updatedFeedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while updating feedback" });
    }
});

// Delete feedback
router.route("/delete/:id").delete(async (req, res) => {
    const userId = req.params.id;

    try {
        await Feedback.findByIdAndDelete(userId);
        res.json({ status: "Feedback deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while deleting feedback" });
    }
});

// Get feedback by ID
router.route("/get/:id").get(async (req, res) => {
    const userId = req.params.id;

    try {
        const feedback = await Feedback.findById(userId);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }
        res.json({ status: "Feedback fetched", feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching feedback" });
    }
});



// Get accepted feedbacks
router.route("/accepted").get(async (req, res) => {
    try {
        const acceptedFeedbacks = await Feedback.find({ status: 'Accepted' });
        res.json(acceptedFeedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching accepted feedbacks" });
    }
});

module.exports = router;


module.exports = router;