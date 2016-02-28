var posts = ["SAME", "SAME1", "SAME2"];
var post_index = 0;
var post_count = 0;

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

function retrieve_posts() {
  $.get("http://bounce9833.azurewebsites.net/api/post", {lat: 1, lng: 2, offset: post_count}, function(new_posts) {
    posts = posts.concat(new_posts); 
    post_count = posts.length;
    for(var i = 0; i < new_posts.length; i++) {
      $("#card-view").append("<div class='item'>" + new_posts[i].text + "</div>");
    }
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
