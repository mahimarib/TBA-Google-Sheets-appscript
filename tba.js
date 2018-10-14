function getJSON(url) {
    var options = {
        "headers": {
            "X-TBA-Auth-Key": "" // enter your own key from your TBA account
        }
    };
    var response = UrlFetchApp.fetch(url, options);
    var content = response.getContentText();
    var json = JSON.parse(content);
    return json;
}

/**
 * Gets the teams nickname
 *
 * @param {"frc4571"} teamKey TBA Team keys (eg `frc4571`) for teams on this alliance
 * @custumFunction
 */
function getNickname(teamKey) {
    var team = getJSON("https://www.thebluealliance.com/api/v3/team/" + teamKey);
    return team.nickname;
}