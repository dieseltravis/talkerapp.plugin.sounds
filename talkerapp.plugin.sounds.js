plugin.command = 'play';
plugin.usage = '/play';

//TODO:replace audio domain with host
//https://123.campfirenow.com/
plugin.AUDIO_PATH = "https://123.campfirenow.com/sounds/";
plugin.IMAGE_PATH = "https://123.campfirenow.com/images/";

plugin.formatImage = function (img) {
    return '<img src="' + plugin.IMAGE_PATH + img +
        '" style="position:relative; top:2px" alt="' + img +
        '" title="" />';
};

//https://gist.github.com/davist11/1204569
plugin.textMap = {
    "56k": plugin.formatImage("56k.gif"),
    bell: ":bell:",
    bezos: ":laughing::thought_balloon:",
    bueller: "anyone?",
    clowntown: plugin.formatImage("clowntown.gif"),
    crickets: "hears crickets chirping",
    dangerzone: plugin.formatImage("dangerzone.png"),
    danielsan: ":fireworks: :trophy: :fireworks:",
    deeper: plugin.formatImage("images/top.gif"),
    drama: plugin.formatImage("drama.jpg"),
    greatjob: plugin.formatImage("greatjob.png"),
    greyjoy: ":confounded::trumpet:",
    guarantee: "guarantees it :ok_hand:",
    heygirl: ":sparkles::information_desk_person::sparkles:",
    horn: ":dog: :scissors: :cat:",
    horror: ":skull: :skull: :skull: :skull: :skull: :skull: :skull: :skull: :skull: :skull:",
    inconceivable: "doesn't think it means what you think it means...",
    live: "is DOING IT LIVE",
    loggins: plugin.formatImage("loggins.jpg"),
    makeitso: "make it so :point_right:",
    noooo: ":princess::skull::unamused:",
    nyan: plugin.formatImage("nyan.gif"),
    ohmy: "raises an eyebrow :smirk:",
    ohyeah: "isn't playing by the rules",
    pushit: plugin.formatImage("pushit.gif"),
    rimshot: "plays a rimshot",
    sax: ":city_sunset::saxophone::notes:",
    secret: "found a secret area :key:",
    sexyback: ":underage:",
    story: "and now you know...",
    tada: "plays a fanfare :flags:",
    tmyk: ":sparkles: :star: The More You Know :sparkles: :star:",
    trololo: "троллинг :trollface:",
    trombone: "plays a sad trombone",
    vuvuzela: "======<() ~ ♪ ~♫",
    what: plugin.formatImage("what.gif"),
    whoomp: ":clap::bangbang::sunglasses:",
    yeah: plugin.formatImage("yeah.gif"),
    yodel: ":mega::mount_fuji::hear_no_evil:"
};

plugin.Sound = function (matcher, keyName) {
    this.matcher = matcher;
    this.replacementString = function (m, g1) {
        var key = keyName || g1,
            extra = plugin.textMap[key];

        if (extra) {
            // handle emoji
            extra = extra.replace(/:(\w+):/gi, '<img src="' + plugin.IMAGE_PATH + 'emoji/$1.png" class="emoticons" height="24" width="24" style="position:relative; top:2px" alt="$1" title="$1" />');
        }
        return (extra ? extra + " " : "") + '<audio src="' + plugin.AUDIO_PATH + key + '.mp3" autoplay controls style="position:relative; display: inline-block; min-height: 15px; min-width: 100px">' + key + '</audio>';
    };
};

plugin.sounds = (function () {
	var allSounds = [
		[/^\/play\s+(56k|bell|bezos|bueller|clowntown|crickets|dangerzone|danielsan|deeper|drama|greatjob|greyjoy|guarantee|heygirl|horn|horror|inconceivable|live|loggins|makeitso|nyan|ohmy|ohyeah|pushit|rimshot|sax|secret|sexyback|story|tada|tmyk|trombone|vuvuzela|what|whoomp|yodel)/ig, null],
        // special cases
		[/^\/play\s+no+/ig, 'noooo'],
		[/^\/play\s+tro(lo)+/ig, 'trololo'],
		[/^\/play\s+ye+a+h+/ig, 'yeah']
	];

	var _sounds = [];
	for (var i = allSounds.length; i--;) {
	    _sounds.push(
			new plugin.Sound(
				allSounds[i][0],
				allSounds[i][1]
			)
		);
	}

    // match for linked mp3s
	_sounds.push({
	    matcher: /^\/play\s+(?:<a[^>]*>)?((?:https?\:)?\/\/\S+\.(?:mp3|wav|mp4|aac|m4[abpvr]|og[gaxv]|3g[p2]))(?:<\/a>)?/ig,
	    replacementString: '<audio src="$1" controls style="position:relative; display: inline-block; min-height: 15px; min-width: 100px">$1</audio> <a href="$1">download</a>'
	});

    // default match for invalid or help entries
	_sounds.push({
        matcher: /^\/play/ig,
        replacementString: "usage: <pre>\/play [56k|bell|bezos|bueller|clowntown|crickets|dangerzone|danielsan|deeper|drama|greatjob|greyjoy|guarantee|heygirl|horn|horror|inconceivable|live|loggins|makeitso|noooo|nyan|ohmy|ohyeah|pushit|rimshot|sax|secret|sexyback|story|tada|tmyk|trololo|trombone|vuvuzela|what|whoomp|yeah|yodel]\n" +
            "\/play [uri to audio file]</pre>"
    });

	return _sounds;
}());

plugin.onMessageInsertion = function (talkerEvent) {
    var element = Talker.getLastInsertion();
    console.log("Talker.getLastInsertion()");
    console.log(element);

	_.each(plugin.sounds, function (sound) {
	    element[0].innerHTML = element[0].innerHTML.replace(sound.matcher, sound.replacementString);
	});
};

plugin.onCommand = function (talkerEvent) {
    if (talkerEvent.command == plugin.command) {
        // pass command through
        console.log("Talker.getMessageBox().val()");
        console.log(Talker.getMessageBox().val());
        Talker.sendMessage(Talker.getMessageBox().val());
        Talker.getMessageBox().val('');
        return false;
    }
};