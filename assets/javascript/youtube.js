   var bandName = "pink"
   
   
   // 2. This code loads the IFrame Player API code asynchronously.
   var tag = document.createElement('script');

   tag.src = "https://www.youtube.com/iframe_api";
   var firstScriptTag = document.getElementsByTagName('script')[0];
   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

   // 3. This function creates an <iframe> (and YouTube player)
   //    after the API code downloads.

   var player;
   function onYouTubeIframeAPIReady() {
     player = new YT.Player('player', {
       height: '390',
       width: '640',
        playerVars: {
            listType: "search",
            list: bandName
        },
       events: {
       }
     });
   }

   // 4. The API will call this function when the video player is ready.
   function onPlayerReady(event) {
     event.target.playVideo();
   }


   function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

$(document).on("click", function(event) {
    on();
    
});

$("#overlay").on("click", function(event) {
    off(); 
});