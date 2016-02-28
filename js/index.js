var posts = [];
var post_index = 0;
var post_count = 0;
var map;  // Google map object (global variable)

var lat;
var lng;

function setCookie() {
    var exdays = 1;
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "cookie" + "=" + "!!!!" + "; " + expires;
}

function left_card() {
  post_index = (post_index + post_count - 1) % post_count;
  retrieve_comments();
  retrieve_map();
}

function right_card() {
  post_index = (post_index + post_count + 1) % post_count;
  if(post_index == post_count - 3) {
    retrieve_posts();
  }
  retrieve_comments();
  retrieve_map();
}

function retrieve_map() {
  $.get("http://bounce9833.azurewebsites.net/api/post_bounces", {post_id: posts[post_index]._id}, function(bounces) {
    console.log(bounces);
    console.log(bounces[0]);
    console.log(bounces[0].loc);
    // Create a Google coordinate object for where to center the map
    var latlngCenter = new google.maps.LatLng({lng: bounces[0].loc[0], lat: bounces[0].loc[1]} ); // Coordinates of Washington, DC (area centroid)

    // Map options for how to display the Google map
    var mapOptions = { zoom: 12, center: latlngCenter  };

    // Show the Google map in the div with the attribute id 'map-canvas'.
    map = new google.maps.Map(document.getElementById(posts[post_index]._id + 'right'), mapOptions);

    for(var i = 0; i < bounces.length; i++) {
      var latlng = {lat: bounces[i].loc[1], lng: bounces[i].loc[0]};
      var marker = new google.maps.Marker({
        position: latlng,
        map: map,
      });
    }
  });
}

function retrieve_comments() {
  $.get("http://bounce9833.azurewebsites.net/api/comment", {post_id: posts[post_index]._id}, function(comments) {
    var commentString = "";
    for (var i=0; i<comments.length; i++) {
      commentString += '<hr>' + comments[i].text + '<br>';
    }
    commentString += "<hr><input type='text' id='" + posts[post_index]._id + "comment' placeholder='Comment'></input> <a class='btn btn-primary' onclick='add_comment()'>Send</a>";
    $('#' + posts[post_index]._id + 'left').html(commentString);
    return comments;
  });
}

function retrieve_posts() {
  navigator.geolocation.getCurrentPosition(function(geoloc) {
    var lat = parseFloat(geoloc.coords.latitude);
    var lng = parseFloat(geoloc.coords.longitude);
    $.get("http://bounce9833.azurewebsites.net/api/post", {lat: lat, lng: lng, offset: post_count}, function(new_posts) {
      posts = posts.concat(new_posts); 
      post_count = posts.length;
      if (posts.length == 0) {
        $("#card-view").append("<div><h1>No Posts</h1></div>");
      } else {
        for(var i = 0; i < new_posts.length; i++) {
          if (i == 0 && post_index == 0) {
            $("#card-view").append("<div class='item active'>" +
                                 "<div class='flex-container'>" +
                                  "<div class='flex-container large-item flex-vertical'>" +
                                    "<div class='small-item card-left main-text' id='"+ new_posts[i]._id + "text'>" + new_posts[i].text + "</div>" +
                                    "<div class='small-item card-left' id='"+ new_posts[i]._id + "left'>Loading..</div>" +
                                  "</div>" +
                                  "<div id='" + new_posts[i]._id + "right' class='small-item card-right'>Loading..</div>" +
                                "</div>" +
                              "</div>");
          } else { 
            $("#card-view").append("<div class='item'>" +
                                 "<div class='flex-container'>" +
                                  "<div class='flex-container large-item flex-vertical'>" +
                                    "<div class='small-item card-left main-text' id='"+ new_posts[i]._id + "text'>" + new_posts[i].text + "</div>" +
                                    "<div class='small-item card-left' id='"+ new_posts[i]._id + "left'>Loading..</div>" +
                                  "</div>" +
                                  "<div id='" + new_posts[i]._id + "right' class='small-item card-right'>Loading..</div>" +
                                "</div>" +
                              "</div>");
          }
        }
      }
    });
  });
  setTimeout(function() {
    retrieve_comments();
    retrieve_map();
  }, 2000);
}

function new_text_post() {
  navigator.geolocation.getCurrentPosition(function(geoloc) {
    var lat = parseFloat(geoloc.coords.latitude);
    var lng = parseFloat(geoloc.coords.longitude);
    var text = document.getElementById('text').value;
    new_post(text, document.cookie, lat, lng);
    $("#newPostSubmit").hide();
    $("#text").hide();
  });
}

function new_post(text, uid, lat, lng) {
  $.post("http://bounce9833.azurewebsites.net/api/post", {text: text, user_id: uid, lat: lat, lng: lng}, function(message) {
    console.log(message);
  });
}

function add_comment() {
  var text = document.getElementById(posts[post_index]._id + 'comment').value;
  $.post("http://bounce9833.azurewebsites.net/api/comment", {post_id: posts[post_index]._id, user_id: document.cookie, text: text}, function(message) {
      if(message.toLowerCase().indexOf("posted") > -1) {
        toastr.success(message); 
      } else {
        toastr.error("Oops. Something went wrong...");
      }
  })
  retrieve_comments();
}

function bounce() {
  $('#main-container').addClass('animated bounce');
  navigator.geolocation.getCurrentPosition(function(geoloc) {
    var lat = parseFloat(geoloc.coords.latitude);
    var lng = parseFloat(geoloc.coords.longitude);
    $.post("http://bounce9833.azurewebsites.net/api/bounce", {lat: lat, lng: lng, user_id: document.cookie, post_id: posts[post_index]._id}, function(message) {
      if(message.toLowerCase().indexOf("bounced") > -1) {
        toastr.success(message); 
      } else {
        toastr.error("Oops. Something went wrong...");
      }
    })
    retrieve_map();
  });
}

function set_latlng() {
  navigator.geolocation.getCurrentPosition(function(geoloc) {
    lat = geoloc.coords.latitude;
    lng = geoloc.coords.longitude;
  });

}

$(document).ready(function() {
  setCookie();
  retrieve_posts();
})
