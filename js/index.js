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
      $("#card-view").append("<div class='item'>" + 
                               "<div class='flex-container'>" +
                                  "<div class='small-item left'>Left</div>" +
                                  "<div class='large-item middle'>" + new_posts[i].text + "</div>" +
                                  "<div class='small-item right'>Right</div>" +
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

$(document).ready(function() {
  retrieve_posts();
})
