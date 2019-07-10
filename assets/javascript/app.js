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
                imgWidth : result.data[i].images["original_still"].width,
                imgHeight : result.data[i].images["original_still"].height,
                imgAspect : result.data[i].images["original_still"].width / result.data[i].images["original_still"].height,
                imgType : result.data[i].type,
                imgTitle : imgTitle,
                imgImportDate : result.data[i].import_datetime,
                imgSize : (result.data[i].images["original"].size / 1024 / 1024)

            })
        }

        // this code block takes the tempGiphyArray from above and sorts the data based on the imgHeight object.
        // Depending on the current offset value, stored in the giphyAPISettings we determine if the current offset is odd or even.
        // Even numbers sort, heights from Lowest to Highest
        // Odd numbers sort, heights from Highest to Lowest
        // This ensures that when appending Gifs from the same button we sort the new gifs by height.  This is a best effort attempt to put tall
        // images and shorter images together so when the page resorts the cards during a responsive action they can try to maintain some sort of
        // order.
        // This is 100% a best effort function to make things look a bit cleaner
        // Note: offset is determined by the giphySearchButton if the same giphy button is clicked then we increment the offset in the click event.
        // this block of code looks at that offset and determines if it is an even or odd number.
        tempGiphyArray = tempGiphyArray.sort(function(a,b){
            if(((that.giphyApplication.giphyAPISettings.offset / that.giphyApplication.giphyAPISettings.limit) % 2) === 0){
                return a.imgHeight - b.imgHeight
            } else {
                return b.imgHeight - a.imgHeight
            }
            
        })

        // this code block is used to build the actual Card for the Giphy individual result
        for(i=0; i < tempGiphyArray.length; i++){
            var tempCol = $("<div>")
            tempCol.attr("class","m-2")
            var tempCard = $("<div>")
            if (this.giphyAPISettings.offset === 0){
                tempCard.attr("class", "card giphyCard")    
            } else {
                tempCard.attr("class", "card giphyCard border-success text-white bg-success")
            }
            var tempCardHeader = $("<div>")
            tempCardHeader.attr("class", "card-header")
            var tempCardSubtitle = $("<p>")
            tempCardSubtitle.attr("class","h6 h6-responsive card-subtitle mb-2")
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

// This is the onclick function for the Search Giphy Buttons, if the button clicked is the same as the last button clicked then we will 
// append the giphys to the current results adding a green color to the cards to clearly call out the new ones.  This also clears the green color
// of existing cards for new ones to use it. 
$(document).on("click",".giphySearchButton", function(){
    if($(this).attr("Value") === that.giphyApplication.giphyAPISettings.lastQuery){
        that.giphyApplication.giphyAPISettings.offset = that.giphyApplication.giphyAPISettings.offset + that.giphyApplication.giphyAPISettings.limit
        $(".giphyCard").attr("class", "card giphyCard")
    } else {
        $("#giphyResults").empty()
        that.giphyApplication.giphyAPISettings.offset = 0
    }
    var giphyURL = that.giphyApplication.buildGiphyAPIUrl($(this).attr("Value"))
    that.giphyApplication.searchGiphy(giphyURL);
})


// on Click function is used to animate the image if stopped or stop it if animated.
$(document).on("click",".giphyIMG", function(){
    if($(this).attr("img-is-still") === "true"){
        $(this).attr("src",$(this).attr("img-animate"))
        $(this).attr("img-is-still","false")
    } else {
        $(this).attr("src",$(this).attr("img-still"))
        $(this).attr("img-is-still","true")
    }
})