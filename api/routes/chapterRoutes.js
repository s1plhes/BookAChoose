const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');


router.get('/chapters', chapterController.getChapters);
router.get('/book_chapter/:id', chapterController.getChapterById);
router.get('/chapter/:book_id', chapterController.getChapterByBookId);
router.post('/chapter/create', chapterController.createChapter);
router.put('/chapter/:id', chapterController.updateChapter);
router.delete('/chapter/:id', chapterController.deleteChapter);
router.post('/chapter/:id/view', chapterController.incrementViews);
router.post('/chapter/:id/like', chapterController.incrementLikes);

module.exports = router;

