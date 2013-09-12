/**********************************************************
 * EXPERIMENTER CAN SET PROPERTIES HERE
 **********************************************************/
// Write any information that you need to identify the data from this experiment
// If you change the experiment, change this version tag, and then store the notes
// in your "lab notebook"
var exptag = "V1";

// which colors will be used
var colors = ["red","green","blue","yellow","orange","purple","brown"];

// how many trials?
var ntrials = 10;

// include instructions?
var showinstructions = true;

// give feedback?
var givefeedback = false;

// don't repeat colors if you can avoid it?
var avoidrepeatcolors = true;

// randomize color choices over blocks
var randomcolors = true;

// how long to pause between trials (in milliseconds)
var mswait = 2000;

// how long to pause between blocks
var betweenblocksms = 3000;

// how many blocks?  the same as we have colors for now.
var nblocks = colors.length;

// Blocks are set by default in the following order:
// One target, Two targets...etc.
// JavaScript counts from zero!
var allblocks = [0,1,2,3,4,5];

// randomize block order?
var randomizeblocks = false;

// which should we negate?
var negate = [false,false,false,false,false,false];

/**********************
* Domain general code *
**********************/

// Helper functions

// Assert functions stolen from 
// http://aymanh.com/9-javascript-tips-you-may-not-know#assertion
function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
	return 'AssertException: ' + this.message;
};

function assert(exp, message) {
	if (!exp) {
		throw new AssertException(message);
	}
}

function insert_hidden_into_form(findex, name, value ) {
	var form = document.forms[findex];
	var hiddenField = document.createElement('input');
	hiddenField.setAttribute('type', 'hidden');
	hiddenField.setAttribute('name', name);
	hiddenField.setAttribute('value', value );
	form.appendChild( hiddenField );
}


// Preload images (not currently in use)
function imagepreload(src) 
{
	var heavyImage = new Image(); 
	heavyImage.src = src;
}

/** 
 * SUBSTITUTE PLACEHOLDERS WITH string values 
 * @param {String} str The string containing the placeholders 
 * @param {Array} arr The array of values to substitute 
 * From Fotiman on this forum:
 * http://www.webmasterworld.com/javascript/3484761.htm
 */ 
function substitute(str, arr) 
{ 
	var i, pattern, re, n = arr.length; 
	for (i = 0; i < n; i++) { 
		pattern = "\\{" + i + "\\}"; 
		re = new RegExp(pattern, "g"); 
		str = str.replace(re, arr[i]); 
	} 
	return str; 
} 

function randrange ( lower, upperbound ) {
	// Finds a random integer from 'lower' to 'upperbound-1'
	return Math.floor( Math.random() * upperbound + lower );
}

// We want to be able to alias the order of stimuli to a single number which
// can be stored and which can easily replicate a given stimulus order.
function changeorder( arr, ordernum ) {
	var thisorder = ordernum;
	var shufflelocations = new Array();
	for (var i=0; i<arr.length; i++) {
		shufflelocations.push(i);
	}
	for (i=arr.length-1; i>=0; --i) {
		var loci = shufflelocations[i];
		var locj = shufflelocations[thisorder%(i+1)];
		thisorder = Math.floor(thisorder/(i+1));
		var tempi = arr[loci];
		var tempj = arr[locj];
		arr[loci] = tempj;
		arr[locj] = tempi;
	}
	return arr;
}

// Fisher-Yates shuffle algorithm.
// modified from http://sedition.com/perl/javascript-fy.html
function shuffle( arr, exceptions ) {
	var i;
	exceptions = exceptions || [];
	var shufflelocations = new Array();
	for (i=0; i<arr.length; i++) {
		if (exceptions.indexOf(i)==-1) { shufflelocations.push(i); }
	}
	for (i=shufflelocations.length-1; i>=0; --i) {
		var loci = shufflelocations[i];
		var locj = shufflelocations[randrange(0, i+1)];
		var tempi = arr[loci];
		var tempj = arr[locj];
		arr[loci] = tempj;
		arr[locj] = tempi;
	}
	return arr;
}

// This function swaps two array members at random, provided they are not in
// the exceptions list.
function swap( arr, exceptions ) {
	var i;
	var except = exceptions ? exceptions : [];
	var shufflelocations = new Array();
	for (i=0; i<arr.length; i++) {
		if (except.indexOf(i)==-1) shufflelocations.push(i);
	}

	for (i=shufflelocations.length-1; i>=0; --i) {
		var loci = shufflelocations[i];
		var locj = shufflelocations[randrange(0,i+1)];
		var tempi = arr[loci];
		var tempj = arr[locj];
		arr[loci] = tempj;
		arr[locj] = tempi;
	}
	return arr;
}

// Mean of booleans (true==1; false==0)
function boolpercent(arr) {
	var count = 0;
	for (var i=0; i<arr.length; i++) {
		if (arr[i]) { count++; } 
	}
	return 100* count / arr.length;
}

// View functions
function appendtobody( tag, id, contents ) {
	var el = document.createElement( tag );
	el.id = id;
	el.innerHTML = contents;
	return el;
}

// Data submission
// NOTE: Ended up not using this.
function posterror() { alert( "There was an error. TODO: Prompt to resubmit here." ); }
function submitdata() {
	$.ajax("submit", {
			type: "POST",
			async: false,
			data: {datastring: datastring},
			// dataType: 'text',
			success: thanks,
			error: posterror
	});
}

/********************
* TASK-GENERAL CODE *
********************/

// Globals defined initially.
var maxblocks = 2;
var keydownfun = function() {};

// Task objects
var testobject;

// Mutable global variables
var responsedata = [],
    currenttrial = 1,
    datastring = "",
    lastperfect = false;

// Data handling functions
function recordinstructtrial (instructname, rt ) {
	trialvals = [workerId, assignmentId, "INSTRUCT", instructname, rt];
	datastring = datastring.concat( trialvals, "\n" );
}
// function recordtesttrial (word, color, trialtype, resp, hit, rt ) {
// 	trialvals = [workerId, assignmentId, currenttrial,  "TEST", word, color, hit, resp, hit, rt];
// 	datastring = datastring.concat( trialvals, "\n" );
// 	currenttrial++;
// }

function recordtesttrial (stim, response, hit, rt) {
	trialvals = ["tag:"+exptag,workerId, assignmentId, stim[0], stim[1], stim[2], stim[3], stim[4], stim[5], response, rt, 
		     'avoidrepeatcolors:'+avoidrepeatcolors, 'givefeedback:'+givefeedback];
        console.log("Writing data:\n");
        console.log(trialvals);
	datastring = datastring.concat( trialvals, "\n" );
	currenttrial++;
}

/********************
* HTML snippets
********************/
var pages = {};

var showpage = function(pagename) {
	$('body').html( pages[pagename] );
};

var pagenames = [
	"postquestionnaire",
	"test",
	"instruct"
];


/************************
* CODE FOR INSTRUCTIONS *
************************/
var Instructions = function( screens ) {
	var that = this,
		currentscreen = "",
		timestamp;
	for( i=0; i<screens.length; i++) {
		pagename = screens[i];
		$.ajax({ 
			url: pagename + ".html",
			success: function(pagename){ return function(page){ pages[pagename] = page; }; }(pagename),
			async: false
		});
	}

	this.recordtrial = function() {
		rt = (new Date().getTime()) - timestamp;
	        // don't record the rt for this
		//recordinstructtrial( currentscreen, rt  );
	};
	
	this.nextForm = function () {
		var next = screens.splice(0, 1)[0];
		currentscreen = next;
		showpage( next );
		timestamp = new Date().getTime();
		if ( screens.length === 0 ) $('.continue').click(function() {
			that.recordtrial();
			that.startTest();
		});
		else $('.continue').click( function() {
			that.recordtrial();
			that.nextForm();
		});
	};
	this.startTest = function() {
		// startTask();
		testobject = new TestPhase();
	};
	this.nextForm();
};


/********************
* CODE FOR TEST     *
********************/

var TestPhase = function() {
	var i,
	    that = this, // make 'this' accessble by privileged methods
	    lock,
	    stimimage,
	    buttonson;
	
	this.hits = new Array();
	
	var acknowledgment = '<p>Thanks for your response!</p>';
	var textprompt = '<p id="prompt">Type<br> "F" for left<br>"J" for right<br>';
	var blockprompt = '<p id="prompt">Press the space bar to begin.</p>';
	showpage( 'test' );
	
	var addprompt = function() {
		buttonson = new Date().getTime();
		$('#query').html( textprompt ).show();
	};

	var setfeedback = function(msg) {
		$('#query').html( msg ).show();
	};

	var addblockprompt = function() {
		$('#query').html( blockprompt ).show();
	};

	var clearprompt = function() {
		$('#query').html( "" ).show();
	};

	var clearinstructions = function() {
		$('#query').html( "" ).show();
	};


        // some colors need to be tweaked.  this is where we do it.
	var convertcolor = function(color) {
	    console.log("converting colors");
	    switch(color) {
	    case "red":
		console.log("red conversion");
		return "rgb(255,0,0)";
		break;
	    case "orange":
		console.log("orange conversion")
		return "rgb(255,165,0)";
		break;
	    case "brown":
		console.log("brown conversion")
		return "rgb(139,69,19)";
		break;

	    default:
		return color;
		
	    }
	    return color;
	};

	var addinstruct = function(ins) {
		$('#instructions').html( ins ).show();
	};
	
	var finishblock = function() {
		keydownfun = function() {}; // Should unbind keys.
		givequestionnaire();
	};
	
	var responsefun = function( e) {
	        console.log("===> Caught response.")
		if (!listening) return;
			keyCode = e.keyCode;
	        console.log("===> Listening!");
	        console.log("===> Key pressed: " + keyCode);
	        if ( instructing && keyCode==32) {
		    instructing = false;
		    listening = false;
		    responsefun = function() {};		    
		    removecolor();
		    nexttrial();		    
		} else if ( instructing) {
		    console.log("!!! Space Bar Not Pressed.");
		} else {

		    var response;
		    switch (keyCode) {
		    case 70:
			// "F"
			response="left";
			break;
		    case 74:
			// "J"
			response="right";
			break;
		    default:
			response = "";
			break; }

		    if ( response.length>0 ) {
		        console.log("===> Responded: " + response)
		        console.log(stim)
			listening = false;
			responsefun = function() {};
			var hit = response == stim[2];
			var rt = new Date().getTime() - wordon;
			recordtesttrial (stim, response, hit, rt );	        
			if (givefeedback) {
			    removecolor();
			    if (hit) {
				setfeedback('<p style="color:white; font-size:40pt">Correct!</p>'); }
			    else {
				setfeedback('<p style="color:white; font-size:40pt">Wrong!</p>');} 
			    setTimeout(function(){
				removecolor();
				nexttrial();
			    },mswait);
			} else {
			    removecolor();
			    setTimeout(function(){
				nexttrial();
			    },mswait);
			}
		    }
		}
	};

	var nexttrial = function () {
		if (! stims.length) {
			finishblock();
		}
		else {		        
			if (dontpop) {
			    // next time do pop
			    dontpop = false; }
		        else {
			    stim = stims.pop();}			    
		        // for a new block
		        if (stim[4] != thisblock) {
			    if (showinstructions) {
				addinstruct(stim[3]); }
			    else {
				addinstruct("");}
			    clearprompt();
			    // wait 3 seconds before continuing
			    setTimeout(function(){
				thisblock = stim[4];
				listening = true;
				instructing = true;
				addblockprompt();
				dontpop = true;
				// next time don't pop
			    },betweenblocksms);
			}
			else {
			    addinstruct(textprompt);
			    console.log("====> trying to remove instructions")
			    showcolor( convertcolor(stim[0]), convertcolor(stim[1]) );
			    //show_word( convertcolor(stim[0]));
			    wordon = new Date().getTime();
			    //addprompt();
			    clearprompt();
                            listening = true;
			}
		}
	};

	
	//Set up stimulus.
	var R = Raphael("stimleft", 400, 200),
		font = "64px Helvetica";

	var Rb = Raphael("stimright", 400, 200),
		font = "64px Helvetica";

	var showcolor = function(colorl, colorr) {
	        R.circle(200, 100, 100).attr({fill: colorl, "fill-opacity": 1, "stroke-width": 0});
	        Rb.circle(200, 100, 100).attr({fill: colorr, "fill-opacity": 1, "stroke-width": 0});
	};

	var removecolor = function() {
		R.clear();
	        Rb.clear();
	};


	$("body").focus().keydown(responsefun); 
        listening = false;

        // generate all stimuli beforehand

        var stims =new Array(); 
        var targetcolors =new Array(); 
        shuffle(colors);        
        var othercolors = colors; 

        lasttarget = "";
        lastother = "";
    
        var targetsbyblock = new Array();
        var othersbyblock = new Array();        

        for (var block = 0; block < nblocks-1; block++) {
	    targetcolors[targetcolors.length] = othercolors.pop();
	    targetsbyblock[block] = targetcolors.slice(0);
	    othersbyblock[block] = othercolors.slice(0);
	}	    

        if (randomizecolors) {
            var targetsbyblock = new Array();
            var othersbyblock = new Array();        	    
            for (var block = 0; block < nblocks-1; block++) {
		shuffle(colors);        
		var othercolors = colors; 
		for (var b = 0; b < (block+1); b++) {
		    targetcolors[targetcolors.length] = othercolors.pop();
		}		
		targetsbyblock[block] = targetcolors.slice(0);
		othersbyblock[block] = othercolors.slice(0);
	    }
	}

        // var allblocks = new Array();
        // for (var block = 0; block < nblocks-1; block++) {
	//     allblocks[allblocks.length] = block;
	// }              

        // add randomization of block order
        if (randomizeblocks) {
            shuffle(allblocks);
	}

        for (var b = 0; b < nblocks-1; b++) {
	    block = allblocks[b];
	    console.log("Beginning block " + (1+block));
	    //targetcolors[targetcolors.length] = othercolors.pop();
	    targetcolors = targetsbyblock[block];
	    othercolors = othersbyblock[block];
	    targettext = "";
	    for (var i = 0; i<targetcolors.length-1; i++) {targettext=targettext+targetcolors[i].toUpperCase()+" or "}
	    targettext = targettext+targetcolors[targetcolors.length-1].toUpperCase();
	    othertext = "";
	    for (var i = 0; i<othercolors.length-1; i++) {othertext=othertext+othercolors[i].toUpperCase()+" or "}
	    othertext = othertext+othercolors[othercolors.length-1].toUpperCase();
	    for (var trial = 0; trial < ntrials; trial++) {
		// don't show the same color pair twice in a row
		if (avoidrepeatcolors && targetcolors.length>1 && othercolors.length>1) {
		    while (targetcolors[0]==lasttarget || othercolors[0]==lastother) {
			console.log("===========> shuffling!")
			shuffle(targetcolors);
			shuffle(othercolors);
		    }
		} else {
		    while (targetcolors[0]==lasttarget && othercolors[0]==lastother) {
			console.log("===========> shuffling!")
			shuffle(targetcolors);
			shuffle(othercolors);
		    }
		}
		console.log(targetcolors[0] + "," + othercolors[0])
		if (negate[block]) {
		    displaytext = "Choose the circle that is <b>NOT</b> "+othertext;
		} else {
		    displaytext = "Choose that circle that is "+targettext;
		}
		if (Math.random()>0.5) {
		    stims[stims.length] = [targetcolors[0], othercolors[0],"left",displaytext,block, b];
		} else {
		    stims[stims.length] = [othercolors[0], targetcolors[0],"right",displaytext,block, b];
		}

		lasttarget = targetcolors[0];
		lastother = othercolors[0];
	    }
	}

        stims.reverse();
	
	//shuffle( stims );
        thisblock = -1;
        nexttrial();

        // initialize that we should get a new stimulus
        var dontpop = false;

	return this;
};

/*************
* Finish up  *
*************/
var givequestionnaire = function() {
	var timestamp = new Date().getTime();
	showpage('postquestionnaire');
	//recordinstructtrial( "postquestionnaire", (new Date().getTime())-timestamp );
	$("#continue").click(function () {
		finish();
		submitquestionnaire();
	});
	// $('#continue').click( function(){ trainobject = new TrainingPhase(); } );
	// postback();
};
var submitquestionnaire = function() {
        appendstring = ""
	$('textarea').each( function(i, val) {
		appendstring = appendstring.concat( ",", this.id, ":",  this.value);
	});
	$('select').each( function(i, val) {
		appendstring = appendstring.concat( ",", this.id, ":",  this.value);
	});
        // add other things to datastring
        appendstring = appendstring.concat(",", "timestamp:", new Date().getTime());
        appendstring = appendstring.concat("\n");
        datastring = datastring.replace(/\n/g,appendstring);
	insert_hidden_into_form(0, "assignmentid", assignmentId );
	insert_hidden_into_form(0, "workerid", workerId );        
	insert_hidden_into_form(0, "data", datastring );
	$('form').submit();
};

var startTask = function () {
	// Provide opt-out 
	window.onbeforeunload = function(){
		$.ajax("quitter", {
				type: "POST",
				async: false,
				data: {assignmentId: assignmentId, workerId: workerId, dataString: datastring}
		});
		alert( "By leaving this page, you opt out of the experiment.  You are forfitting your $1.00 payment and your 1/10 chance to with $10. Please confirm that this is what you meant to do." );
		return "Are you sure you want to leave the experiment?";
	};
};

var finish = function () {
	window.onbeforeunload = function(){ };
};

// vi: et! ts=4 sw=4
