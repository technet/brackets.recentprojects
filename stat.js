
function findEntry(data,id){
    return $.grep(data, function(item){
      return item._id == id;
    });
};


function processStats(data, id) {
    
    var entry = findEntry(data, id);
    if (entry && entry.length > 0) {                
        $('#total').html("Downloads: " + entry[0].totalDownloads);   
        var downloads = entry[0].downloads;
        if (downloads && downloads.length > 0) {
            
            var daily = $("#daily");
            var previous = 0;
            for(i=0; i<downloads.length; i++) {
                var item = downloads[i];                
                if (item.count) {
                    daily.append("<li>"+ item.timestamp.substring(0,10) + " : " + item.count + " (" + (item.count - previous)  +")"  + "</li>");        
                    previous = item.count;
                }                
            }                           
        }
    }    
}

function processFail() {
    
}


function updateStats(id) {
    
    /*
    $.ajax({
        url: "http://brackets-rating.herokuapp.com/ratings",
        type: "GET",
        dataType: 'jsonp',
//        beforeSend : function(xhr) {
//          xhr.setRequestHeader("Access-Control-Allow-Origin","*");  
//          xhr.setRequestHeader("Access-Control-Allow-Credentials",true);
//        },
        success: function() {
            alert("success");
        },
        error: function(jqJXHR, status, error) {
            
            console.log("error");
        }
    });
    */
    
    that = this;
    that.id = id;
    
    $.getJSON("http://brackets-rating.herokuapp.com/ratings/", function(data) {
        processStats(data, id)        
    });
}