function getTeamPlacement(match, teamKey) {
    var blueTeamKeys = match.alliances.blue.team_keys;
    var redTeamKeys = match.alliances.red.team_keys;
    var teamPlacement = [];
    for (var i = 0; i < 3; i++) {
        if (blueTeamKeys[i] == teamKey) {
            teamPlacement.push('blue', i + 1);
        } else if (redTeamKeys[i] == teamKey) {
            teamPlacement.push('red', i + 1);
        }
    }
    return teamPlacement;
}

/**
 * Returns the match names of the given event with the given format `[COMP_LEVEL] match [MATCH_NUMBER]`.
 * A set number may be appended to
 * the competition level if more than one match in required per set.
 * Only used only for: `/team/{team_key}/event/{event_key}/matches`
 *
 * @param {"frc4571"} teamKey TBA Team keys (eg `frc4571`)
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`,
 *                              where `yyyy` is the year, and `EVENT_CODE` is the
 *                              event code of the event.
 * @customFunction
 */
function getTeamMatches(teamKey, eventKey) {
    var matches = getJSON(
        'https://www.thebluealliance.com/api/v3/team/' +
            teamKey +
            '/event/' +
            eventKey +
            '/matches'
    );
    var matchNames = [];
    for (var i in matches) {
        var compLevel = matches[i].comp_level;
        var setNumber = matches[i].set_number;
        var matchNumber = matches[i].match_number;
        matchNames.push(convertMatchNames(compLevel, setNumber, matchNumber));
    }
    return matchNames;
}

function convertMatchNames(compLevel, setNumber, matchNumber) {
    switch (compLevel) {
        case 'qm':
            return 'qualification match ' + matchNumber;
        case 'qf':
            return 'quarter finals ' + setNumber + ' match ' + matchNumber;
        case 'sf':
            return 'semi finals ' + setNumber + ' match ' + matchNumber;
        case 'f':
            return 'finals match ' + matchNumber;
    }
}

/**
 * Returns the status of the robot when match finished, used only for: `/team/{team_key}/event/{event_key}/matches`
 *
 * @param {"frc4571"} teamKey TBA Team keys (eg `frc4571`)
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`,
 *                              where `yyyy` is the year, and `EVENT_CODE` is the
 *                              event code of the event.
 * @customFunction
 */
function getEndGameStat(teamKey, eventKey) {
    var matches = getJSON(
        'https://www.thebluealliance.com/api/v3/team/' +
            teamKey +
            '/event/' +
            eventKey +
            '/matches'
    );
    var endGameStats = [];
    for (var i in matches) {
        var teamPlacement = getTeamPlacement(matches[i], teamKey);
        var alliance = teamPlacement[0];
        var number = teamPlacement[1];
        endGameStats.push(
            matches[i].score_breakdown[alliance]['endgameRobot' + number]
        );
    }
    return endGameStats;
}

/**
 * Returns whether robot crossed the line, used only for: `/team/{team_key}/event/{event_key}/matches`
 *
 * @param {"frc4571"} teamKey TBA Team keys (eg `frc4571`)
 * @param {"2018nyny"} eventKey TBA event key with the format `yyyy[EVENT_CODE]`,
 *                              where `yyyy` is the year, and `EVENT_CODE` is the
 *                              event code of the event.
 * @customFunction
 */
function getAutoStat(teamKey, eventKey) {
    var matches = getJSON(
        'https://www.thebluealliance.com/api/v3/team/' +
            teamKey +
            '/event/' +
            eventKey +
            '/matches'
    );
    var AutoStats = [];
    for (var i in matches) {
        var teamPlacement = getTeamPlacement(matches[i], teamKey);
        var alliance = teamPlacement[0];
        var number = teamPlacement[1];
        AutoStats.push(
            getAuto(matches[i].score_breakdown[alliance]['autoRobot' + number])
        );
    }
    return AutoStats;
}
