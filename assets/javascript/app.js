var that = this;

var giphyApplication = {
    defaultSearch : ['Apple','Bananas','Tomatos','BlueBerry'],
    giphyAPISettings : {
        search : "https://api.giphy.com/v1/gifs/search?",
        limit : 10,
        offset : 0,
        rating : ["G","PG"],
        lang : "en",
        api_key : "VVnRvemZmH6Ra2CTJWaS4HBLRA37jTHJ"
    },
    buildDefaultButtons : function (){
        for(i=0; i < this.defaultSearch.length ; i++){
            this.addButtons(this.defaultSearch[i])
        }
    },
    addButtons : function(buttonValue){
        var tempButtonSpan = $("<span>")
        tempButtonSpan.text(buttonValue);
        var tempButton = $("<btn>")
        tempButton.attr("class","btn btn-info p-2 m-2 giphySearchButton")
        tempButton.attr("id",buttonValue)
        tempButton.attr("value",buttonValue)
        tempButton.append(tempButtonSpan)
        $("#giphyButtons").append(tempButton)
    },
    buildGiphyAPIUrl : function(searchString){
        var giphyURL = this.giphyAPISettings.search
        giphyURL += "api_key=" + this.giphyAPISettings.api_key + "&limit=" + this.giphyAPISettings.limit + "&offset=" + this.giphyAPISettings.offset + "&lang=" + this.giphyAPISettings.lang
        for(i=0;i<this.giphyAPISettings.rating.length;i++){
            giphyURL += "&rating=" + this.giphyAPISettings.rating[i]
        }
        giphyURL += "&q=" + searchString
        console.log(giphyURL)
        return giphyURL
    },
    searchGiphy : function(giphyURL){
        $.ajax({
            url: giphyURL,
            type : 'GET'
        }).then( function(result){
                console.log(result);
                return result;
            })
    }
}

// Same thing as $(documnet).ready(function(){}); ----- Shorthand version $(function(){})
$(function(){
    that.giphyApplication.buildDefaultButtons();
})

$("#createNewButton").on("click", function(event){
    event.preventDefault()
    if($("#giphySearch").val()){
        that.giphyApplication.addButtons($("#giphySearch").val())
        document.giphyForm.reset()
    } else {
        //Mother Fucker is just Click Buttons
    }
})

$(document).on("click",".giphySearchButton", function(){
    $(this).attr("Value")
    var giphyURL = that.giphyApplication.buildGiphyAPIUrl($(this).attr("Value"))
    var giphyResult = that.giphyApplication.searchGiphy(giphyURL)
    console.log(giphyResult)
})