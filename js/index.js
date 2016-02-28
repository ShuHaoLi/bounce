var posts = ["SAME", "SAME1", "SAME2"];
var post_index = 0;
var post_count = 0;
var map;  // Google map object (global variable)

function left_card() {
  post_index = (post_index + post_count - 1) % post_count;  
  console.log(post_index);
}

function right_card() {
  post_index = (post_index + post_count + 1) % post_count;  
  console.log(post_index);
  if(post_index == post_count - 3) {
    retrieve_posts();
  }
}

function retrieve_map() {
  $.get("http://bounce9833.azurewebsites.net/api/post_bounces", {post_id: posts[post_index]._id}, function(bounces) {
    // Create a Google coordinate object for where to center the map
    var latlngDC = new google.maps.LatLng( 38.8951, -77.0367 ); // Coordinates of Washington, DC (area centroid)
    
    // Map options for how to display the Google map
    var mapOptions = { zoom: 12, center: latlngDC  };
    
    // Show the Google map in the div with the attribute id 'map-canvas'.
    map = new google.maps.Map(document.getElementById(posts[post_index]._id + 'right'), mapOptions);
  });
}

function retrieve_comments() {
  $.get("http://bounce9833.azurewebsites.net/api/comment", {post_id: posts[post_index]._id}, function(comments) {
    console.log(comments);
    console.log($('#' + posts[post_index]._id + 'left'));
    $('#' + posts[post_index]._id + 'left').html(comments);
    return comments;
  });
}

function retrieve_posts() {
  $.get("http://bounce9833.azurewebsites.net/api/post", {lat: 1, lng: 2, offset: post_count}, function(new_posts) {
    console.log(new_posts);
    posts = posts.concat(new_posts); 
    post_count = posts.length;
    for(var i = 0; i < new_posts.length; i++) {
      $("#card-view").append("<div class='item'>" +
                               "<div class='flex-container'>" +
                                  "<div id='" + new_posts[i]._id + "left' class='small-item left'>Left</div>" +
                                  "<div class='large-item middle'>" + new_posts[i].text + "</div>" +
                                  "<div id='" + new_posts[i]._id + "right' class='small-item right'>Right</div>" +
                                "</div>" +
                              "</div>");

    }

    set_click_events();
  });
}

function set_click_events() {
  $(".left").click(function(){
    $(this).css("flex-grow",2);
    $(this).parent().children(".middle").css("flex-grow",1);
    $(this).parent().children(".right").css("flex-grow",1);
  });
  $(".middle").click(function(){
    $(this).css("flex-grow",2);
    $(this).parent().children(".left").css("flex-grow",1);
    $(this).parent().children(".right").css("flex-grow",1);
  });
  $(".right").click(function(){
    $(this).css("flex-grow",2);
    $(this).parent().children(".left").css("flex-grow",1);
    $(this).parent().children(".middle").css("flex-grow",1);
  });
}

function new_text_post() {
  var text = document.getElementById('text').value;
  new_post(text, "41sacxa", 1, 2); // Hard coded
}

function new_post(text, uid, lat, lng) {
  $.post("http://bounce9833.azurewebsites.net/api/post", {text: text, user_id: uid, lat: lat, lng: lng}, function(message) {
    console.log(message);
  });
}

$(document).ready(function() {
  retrieve_posts();
})
