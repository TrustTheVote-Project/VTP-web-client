// Color JSON strings
function syntaxHighlightJSON(jsonString, digestURL=null, contestNumber=null) {
    let newString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    newString = newString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'JSONnumber';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'JSONkey';
            } else {
                cls = 'JSONstring';
                // Handle digest links
                if (digestURL && contestNumber && match) {
                    //
                    let newMatch = match;
                    let link_p = false;
                    newMatch = newMatch.replace(/([a-fA-F0-9]{40})/g, function (match) {
                        link_p = true;
                        return `<a target="_blank" href=${digestURL}?contestNumber=${contestNumber}&digests=${match}>${match}</a>`;
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

// Color STDOUT log strings, which is passed as an array of strings (one per line)
function syntaxHighlightStdout(jsonArray, digestURL=null, tallyURL=null) {
    // Handle digest links
    let newOutput = []
    for (let line of jsonArray) {
        let newLine = line;
        let digest = false;
        // Convert digests to hrefs
        newLine = newLine.replace(/\b([a-fA-F0-9]{40})\b/, function (match) {
            digest = match;
            return `<a target="_blank" href=${digestURL}?digest=${digest}>${digest}</a>`;
        });
        // Convert contest uids to hrefs
        if (digest) {
            newLine = newLine.replace(/\b([0-9]{4}\b)/, function (match) {
                return `<a target="_blank" href=${tallyURL}?contest=${match}&digests=${digest}>${match}</a>`;
            });
        }
        // Handle GOOD and BAD lines
        if (line.match(/^\[GOOD\]/) || line == "*".repeat(12)) {
            newLine = `<span class=good>${newLine}</span>`;
        }
        if (line.match(/^\[ERROR\]/) || line == "#".repeat(12)) {
            newLine = `<span class=error>${newLine}</span>`;
        }
        if (line.match(/^\[WARNING\]/) || line == "=".repeat(12)) {
            newLine = `<span class=warning>${newLine}</span>`;
        }
        // Handle text based horizontal lines
        newLine = newLine.replace(/^(-)+/, function (match) {
            return `<span class=warning>${newLine}</span>`;
        });
        // Handle leading spaces
        newLine = newLine.replace(/^( )+/, function (match) {
            return `${"&nbsp;".repeat(match.length)}`;
        });
        // Save
        newOutput.push(newLine);
    };
    return newOutput.join("<br>");
}
