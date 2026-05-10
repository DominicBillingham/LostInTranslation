

function doPost(e) {
    try {

        const data = JSON.parse(e.postData.contents);

        if (data.LogKey !== "passwordToBeSet") {
            return ContentService
                .createTextOutput("")
                .setMimeType(ContentService.MimeType.TEXT);
        }

        // Route based on data.Type
        if (data.Type === "Story") {
            return logStory(data);
        }

        if (data.Type === "Quiz") {
            return logQuiz(data);
        }

    } catch (err) {
        // silently fail (as your original code does)
    }
}


/* ---------- STORY LOGGER (your original logic) ---------- */

function logStory(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("StoryChoices");

    sheet.appendRow([
        data.UserId,
        data.StoryDecision,
        data.StoryChoice,
        data.StoryDecisionCount,
        data.TimeSpentChoosing,
        data.PlaythroughCount,
        data.PaperFirst
    ]);
}


/* ---------- QUIZ LOGGER (your new format) ---------- */

function logQuiz(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("QuizChoices");

    sheet.appendRow([
        data.UserId,
        data.QuizQuestion,
        data.QuizAnswer,
        data.WasCorrect,
        data.QuizAnswerCount,
        data.TimeSpentChoosing,
        data.PlaythroughCount,
        data.PaperFirst
    ]);
}
