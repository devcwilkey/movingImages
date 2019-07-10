// Setting this to that for reference in Functions as Needed
var that = this;

// Create a Single Object to Hold the Application
var giphyApplication = {
    // Initial Buttons for the Giphy Page
    giphySearch : ['Puppies','Kittens','Baby Animals','Bears','Giraffe'],
    // Setting the giphyAPISettings into an Object
    giphyAPISettings : {
        search : "https://api.giphy.com/v1/gifs/search?",
        lastQuery: "",
        limit : 10,
        offset : 0,
        rating : ["G","PG"],
        lang : "en",
        api_key : "VVnRvemZmH6Ra2CTJWaS4HBLRA37jTHJ"
    },
    // Function that rebuilds the "Search" buttons per the Object Array giphySearch
    buildSearchButtons : function (){
        $("#giphyButtons").empty();
        for(i=0; i < this.giphySearch.length ; i++){
            var tempButtonSpan = $("<span>")
            tempButtonSpan.text(this.giphySearch[i]);
            var tempButton = $("<btn>")
            tempButton.attr("class","btn btn-info p-2 m-2 giphySearchButton")
            tempButton.attr("id",this.giphySearch[i])
            tempButton.attr("value",this.giphySearch[i])
            tempButton.append(tempButtonSpan)
            $("#giphyButtons").append(tempButton)
        }  
    },
    // Function that is used to build our giphyQuery URL for our AJAX call
    buildGiphyAPIUrl : function(searchString){
        var giphyURL = this.giphyAPISettings.search
        giphyURL += "api_key=" + this.giphyAPISettings.api_key + "&limit=" + this.giphyAPISettings.limit + "&offset=" + this.giphyAPISettings.offset + "&lang=" + this.giphyAPISettings.lang
        for(i=0;i<this.giphyAPISettings.rating.length;i++){
            giphyURL += "&rating=" + this.giphyAPISettings.rating[i]
        }
        giphyURL += "&q=" + searchString
        this.giphyAPISettings.lastQuery = searchString;
        return giphyURL
    },
    // Function that is used to perform our giphySearch and then calls our printGiphy Functon with the Results
    searchGiphy : function(giphyURL){
        $.ajax({
            url: giphyURL,
            type : 'GET'
        }).then(function(result){
            that.giphyApplication.printGiphy(result)
        })
    },
    // Function used to print the giphy Results to the Client Web Session.
    printGiphy : function(result){
        // temporary Array created to store the initiall Parsed Result Data.
        var tempGiphyArray = [];

        // for Loop goes through the tempGiphyArray and splits the Title based on the word "GIF"
        // Also creates our giphy Image Object to store in the Array for Sorting
        for(i=0; i < result.data.length; i++){
            if(result.data[i].title.includes("GIF")){
                var imgTitle = result.data[i].title.split("GIF",1)
            } else {
                var imgTitle = result.data[i].title
            }

            tempGiphyArray.push({
                imgStill : result.data[i].images["original_still"].url,
                imgAnimate : result.data[i].images["original"].url,
                imgRating : result.data[i].rating,
                imgAspect : result.data[i].images["original_still"].width/result.data[i].images["original_still"].height,
                imgType : result.data[i].type,
                imgTitle : imgTitle,
                imgImportDate : result.data[i].import_datetime,
                imgSize : (result.data[i].images["original"].size / 1024 / 1024)

            })
        }

        // this code block takes the tempGiphyArray from above and sorts the data based on the Aspect Ratio's.
        // Depending on the current offset value, stored in the giphyAPISettings we determine if the current offset is odd or even.
        // Even numbers sort, Aspect Ratio's Highest to Lowest
        // Odd numbers sort, Aspect Ratios Lowest to Highest
        // This ensures that when appending Gifs from the same button we sort the new gifs by Aspect ratio to try and keep like sized images together.
        // This is 100% a best effort function to make things look a bit cleaner
        // Note: offset is determined by the giphySearchButton if the same giphy button is clicked then we increment the offset in the click event.
        // this block of code looks at that offset and determines if it is an even or odd number.
        tempGiphyArray = tempGiphyArray.sort(function(a,b){
            if(((that.giphyApplication.giphyAPISettings.offset / that.giphyApplication.giphyAPISettings.limit) % 2) === 0){
                return b.imgAspect - a.imgAspect
            } else {
                return a.imgAspect - b.imgAspect
            }
            
        })

        // this code block is used to build the actual Card for the Giphy individual result
        for(i=0; i < tempGiphyArray.length; i++){
            var tempCol = $("<div>")
            tempCol.attr("class","col-12 col-md-6 col-xl-4 mb-2")
            var tempCard = $("<div>")
            tempCard.attr("class", "card")
            var tempCardHeader = $("<div>")
            tempCardHeader.attr("class", "card-header")
            // Since the title varies in length it causes the cards to be very different sizes.
            // var tempCardTitle = $("<h5>")
            // tempCardTitle.attr("class","card-title")
            // tempCardTitle.text(tempGiphyArray[i].imgTitle)
            var tempCardSubtitle = $("<p>")
            tempCardSubtitle.attr("class","h6 h6-responsive card-subtitle mb-2 text-muted")
            tempCardSubtitle.text("Rating: " + tempGiphyArray[i].imgRating.toUpperCase())
            var tempCardBody = $("<div>")
            tempCardBody.attr("class", "class-body")
            var tempCardText = $("<p>")
            tempCardText.attr("class","card-text")
            tempCardText.text("File Size (MB): " + tempGiphyArray[i].imgSize.toFixed(2))
            var tempCardImage = $("<img>")
            tempCardImage.attr("src",tempGiphyArray[i].imgStill)
            tempCardImage.attr("class","img-fluid giphyIMG")
            tempCardImage.attr("img-still",tempGiphyArray[i].imgStill)
            tempCardImage.attr("img-animate",tempGiphyArray[i].imgAnimate)
            tempCardImage.attr("img-is-still","true")
            tempCardBody.append(tempCardText)
            tempCardBody.append(tempCardImage)
            tempCardHeader.append(tempCardSubtitle)
            tempCardHeader.append(tempCardText)
            tempCard.append(tempCardHeader)
            tempCard.append(tempCardBody)
            tempCol.append(tempCard)
            $("#giphyResults").append(tempCol)
        }
    }
}

// Same thing as $(documnet).ready(function(){}); ----- Shorthand version $(function(){})
$(function(){
    that.giphyApplication.buildSearchButtons();
})

$("#createNewButton").on("click", function(event){
    event.preventDefault()
    if($("#giphySearch").val()){
        that.giphyApplication.giphySearch.push($("#giphySearch").val())
        that.giphyApplication.buildSearchButtons();
        document.giphyForm.reset()
    } else {
        //People like to just Click Buttons
    }
})

$(document).on("click",".giphySearchButton", function(){
    if($(this).attr("Value") === that.giphyApplication.giphyAPISettings.lastQuery){
        that.giphyApplication.giphyAPISettings.offset = that.giphyApplication.giphyAPISettings.offset + that.giphyApplication.giphyAPISettings.limit
    } else {
        $("#giphyResults").empty()
        that.giphyApplication.giphyAPISettings.offset = 0
    }
    var giphyURL = that.giphyApplication.buildGiphyAPIUrl($(this).attr("Value"))
    that.giphyApplication.searchGiphy(giphyURL);
})

$(document).on("click",".giphyIMG", function(){
    console.log("help")
    if($(this).attr("img-is-still") === "true"){
        $(this).attr("src",$(this).attr("img-animate"))
        $(this).attr("img-is-still","false")
    } else {
        $(this).attr("src",$(this).attr("img-still"))
        $(this).attr("img-is-still","true")
    }
})