// Color JSON strings
function syntaxHighlight(jsonString, digestURL=null) {
    let newString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    newString = jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'JSONnumber';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'JSONkey';
            } else {
                cls = 'JSONstring';
                // Handle digest links
                if (digestURL && cls == 'JSONstring' && match) {
                    //
                    let newMatch = match;
                    let link_p = false;
                    newMatch = newMatch.replace(/([a-fA-F0-9]{40})/g, function (match) {
                        link_p = true;
                        return `<a target="_blank" href=${digestURL}?digests=${match}>${match}</a>`;
                    });
                    if (link_p) {
                        return newMatch;
                    }
                    return `<span class=${cls}>${newMatch}</span>`;
                }
            }
        } else if (/true|false/.test(match)) {
            cls = 'JSONboolean';
        } else if (/null/.test(match)) {
            cls = 'JSONnull';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    return newString;
}
