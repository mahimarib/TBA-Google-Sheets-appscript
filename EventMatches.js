/**
 * Returns the match names of the given event with the given format `[COMP_LEVEL] match [MATCH_NUMBER]`.
 * A set number may be appended to 
 * the competition level if more than one match in required per set.
 * Only used for `/event/{event_key}/matches`
 *
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`, 
 *                              where `yyyy` is the year, and `EVENT_CODE` is the 
 *                              event code of the event.
 * @customFunction 
 */
function getMatchNames(eventKey) {
    var matches = getJSON("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches");
    var matchNames = [];
    for (var i in matches) {
        var compLevel = matches[i].comp_level;
        var setNumber = matches[i].set_number;
        var matchNumber = matches[i].match_number;
        matchNames.push(convertMatchNames(compLevel, setNumber, matchNumber));
    }
    return matchNames;
}

/**
 * Returns whether the specified robot crossed the auto line for all matches in the event. Only used for `/event/{event_key}/matches`
 *
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`, 
 *                              where `yyyy` is the year, and `EVENT_CODE` is the 
 *                              event code of the event.
 * @param {"blue"} alliance color of alliance `"blue"` or `"red"`
 * @param {1} robotNumber the number of the robot `range: 1 - 3`
 * @customFunction 
 */
function getRobotAuto(eventKey, alliance, robotNumber) {
    var matches = getJSON("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches");
    var robotAuto = [];
    for (var i = 0; i < matches.length; i++) {
        robotAuto.push(getAuto(matches[i].score_breakdown[alliance]['autoRobot' + robotNumber]));
    }
    return robotAuto;
}

function getAuto(string) {
    switch (string) {
        case "AutoRun":
            return "crossed the line";
        case "None":
            return "behind the line";
    }
}

/**
 * Returns the auto points for the secified alliance for all matches in the event. Only used for `/event/{event_key}/matches`
 *
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`, 
 *                              where `yyyy` is the year, and `EVENT_CODE` is the 
 *                              event code of the event.
 * @param {"blue"} alliance color of alliance `"blue"` or `"red"`
 * @customFunction 
 */
function getAutoScore(eventKey, alliance) {
    var matches = getJSON("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches");
    var autoPoints = [];
    for (var i in matches) {
        autoPoints.push(matches[i].score_breakdown[alliance].autoPoints);
    }
    return autoPoints;
}

/**
 * Returns the auto points for the secified event's qualification matches, returns the scores by alternating blue then red alliance scores. Only used for `/event/{event_key}/matches`
 *
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`, 
 *                              where `yyyy` is the year, and `EVENT_CODE` is the 
 *                              event code of the event.
 * @customFunction 
 */
function getAllQMAutoScores(eventKey) {
    var matches = getJSON("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches");
    var autoPoints = [];
    for (var i in matches) {
        if (matches[i].comp_level == "qm") {
            autoPoints.push(matches[i].score_breakdown.blue.autoPoints);
            autoPoints.push(matches[i].score_breakdown.red.autoPoints);
        }
    }
    return autoPoints;
}

/**
 * Returns if the specified alliance completed the auto quest for all matches in the event. Only used for `/event/{event_key}/matches`
 *
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`, 
 *                              where `yyyy` is the year, and `EVENT_CODE` is the 
 *                              event code of the event.
 * @param {"blue"} alliance color of alliance `"blue"` or `"red"`
 * @customFunction 
 */
function didAutoQuest(eventKey, alliance) {
    var matches = getJSON("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches");
    var autoQuest = [];
    for (var i in matches) {
        var score = matches[i].score_breakdown[alliance];
        var ownershipPoints = score.autoOwnershipPoints;
        if ((ownershipPoints > 0) && crossedTheLine(score)) {
            autoQuest.push("completed");
        } else {
            autoQuest.push("not completed");
        }
    }
    return autoQuest;
}

/**
 * Returns the time of the match, this is used to sort the match table in order. 
 * Only used for `/event/{event_key}/matches`
 * 
 * @param  {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`, 
 *                               where `yyyy` is the year, and `EVENT_CODE` is the 
 *                               event code of the event.
 * @customFunction
 */
function getTimeOfMatch(eventKey) {
    var matches = getJSON("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches");
    var matchTimes = [];
    for (var i in matches) {
        matchTimes.push(matches[i].actual_time);
    }
    return matchTimes;
}

function crossedTheLine(score) {
    return score.autoRobot1 == "AutoRun" && score.autoRobot2 == "AutoRun" && score.autoRobot3 == "AutoRun";
}