function isThisRequestNew(reqId)
{
	if (sessionStorage.getItem(reqId))
	{
		return false;
	}
	else
	{
		return true;
	}
}


//var monitoredUrls = ['wikipedia.org', 'mediawiki.org', 'wiktionary.org'];


// for debugging only
var debug = false;
var extensionInfo = browser.management.getSelf();
extensionInfo.then(gotSelf);
function gotSelf(info) {
  extensionInfo = info;
  debug = (info.installType == 'development');
}

/* This function logs debugging info to the browser console, if the extension is installed as a temporary extension.
Otherwise (normal case) nothing is logged. */
function WVSLog(logmsg)
{
	if (debug)
	{
		console.log('Wikipedia Vector Skin:  ' + logmsg);
	}
}



browser.webRequest.onBeforeRequest.addListener(
    function(details)
	{
        var newUrl = new URL(details.url);
		var boolRequestNew = isThisRequestNew(details.requestId);
		if ((details.type == 'main_frame'))
		{
			WVSLog('requestId: '+details.requestId);
			WVSLog('requested URL: '+ newUrl.href);
			
			if (boolRequestNew)
			{
				sessionStorage.setItem(details.requestId, true);
					if (!newUrl.search.includes("useskin=Vector"))
					{
						let params = new URLSearchParams(newUrl.search);
						params.append('useskin', 'monobook');
						newUrl.search = params;
						WVSLog('new URL:       '+ newUrl.href);
						return { redirectUrl: newUrl.href };
					}
			}
		}
    },
    { urls: ["*://*.mediawiki.org/*", "*://*.wikipedia.org/*", "*://*.wiktionary.org/*", "*://*.wikiquote.org/*", "*://*.wikiversity.org/*", "*://*.wikivoyage.org/*", "*://*.wikimedia.org/*", "*://*.wikidata.org/*", "*://*.wikinews.org/*", "*://*.wikisource.org/*", "*://*.wikibooks.org/*"] },
    ["blocking"]
);
