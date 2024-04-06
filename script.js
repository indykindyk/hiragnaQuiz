var hiraganaDict = {
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を',
    'n': 'ん'
};

var gameHiragana = [];

var selectedGroups = [];

var randomKey = "";

var json_str = getCookie('choosen');

console.log(json_str);

if (json_str !== "") {
    selectedGroups = JSON.parse(json_str);

    selectedGroups.forEach(function(val) {
        $("."+val).addClass('selected');
    })
} 

// Function to set a cookie with an array value
function setArrayCookie(name, value, days) {
    // Convert the array to a JSON string
    var jsonValue = JSON.stringify(value);
    // Set the cookie with the JSON string
    document.cookie = name + "=" + jsonValue + ";max-age=" + (days * 24 * 60 * 60) + ";path=/";
}
  
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function setRandomKana() {
    //clear out input
    $(".answer").val("");

    // Choose a random key from the array
    var newKey = gameHiragana[Math.floor(Math.random() * gameHiragana.length)];

    while (randomKey == newKey) {
        newKey = gameHiragana[Math.floor(Math.random() * gameHiragana.length)];
    }

    randomKey = newKey;

    // Retrieve the corresponding value from the dictionary using the random key
    var randomValue = hiraganaDict[randomKey];

    $(".actkana").text(randomValue);
}

setRandomKana();

function checkAnswer() {
    var inputBox = $(".answer");
    var answer = inputBox.val().toLowerCase();
    if (randomKey == answer) {
        setRandomKana();
    }
    else {
        inputBox.addClass("wrong-answer");
        inputBox.effect("shake", {times: 3, distance: 10}, 500);
        setTimeout(function() {
            inputBox.removeClass("wrong-answer");
        }, 450);
    }
}

if (isMobile() == false) {
    $('.grid-item').hover(function(){
        var group = $(this).attr('class').split(" ")[1];
    
        if ($("."+group).hasClass('selected')) {
            $("."+group).addClass('hovered-selected');
        } else {
            $("."+group).addClass('hovered');
        }
    }, function(){
        var group = $(this).attr('class').split(" ")[1];
    
        if ($("."+group).hasClass('selected')) {
            $("."+group).removeClass('hovered-selected');
            $("."+group).removeClass('hovered');
        } else {
            $("."+group).removeClass('hovered');
        }
    });
}

$('.grid-item').on("click", function() {
    var group = $(this).attr('class').split(" ")[1];
    $("."+group).toggleClass('selected')
                .toggleClass('hovered-selected')
                .toggleClass('hovered');

    if (!selectedGroups.includes(group)) {
        selectedGroups.push(group); // Add the element if it doesn't exist
    } else {
        selectedGroups = selectedGroups.filter(item => item !== group); // Remove the element if it exists
    }

    //save array to cookie
    var json_str = JSON.stringify(selectedGroups);
    createCookie('choosen', json_str);
    console.log("saved cookie")
})

$(".answer").on('keypress', function(e) {
    if (e.which == 32) {
        return false;
    } else if (e.which == 13) { 
        checkAnswer();
    }
})

$(".title-bar").on('click', function() {
    $(".settings-page").removeClass('hidden');
    $(".game").addClass('hidden');
});

$(".start").on('click', function() {
    var selectedDivs = document.querySelectorAll('.selected');

    if (selectedDivs.length == 0) {
        console.log("not selected")
        var gridElements = $(".grid-item");

        gridElements.addClass('not-selected');

        //gridElements.effect("shake", {times: 3, distance: 10}, 500);

        setTimeout(function() {
            gridElements.removeClass("not-selected");
        }, 250);

        return;
    }

    gameHiragana = [];

    // Loop through each selected div
    selectedDivs.forEach(function(div) {
        // Find the second span element within the div
        var secondSpan = div.querySelector('.group');
        // Get the text content of the second span
        var value = secondSpan.classList[1];
        //add to the array
        gameHiragana.push(value);
    });

    $(".settings-page").addClass('hidden');
    $(".game").removeClass('hidden');
    setRandomKana();
})