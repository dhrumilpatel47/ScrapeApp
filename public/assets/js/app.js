localStorage.setItem("toggleArticles", true);
var isHiding = localStorage.getItem("toggleArticles");

 if(isHiding === true){
    localStorage.setItem("toggleArticles", false);
    console.log(isHiding);
  }

$(document).ready(function () {
});

$("#scrape-data").on("click", () => {
   isHiding = false;   

  if (isHiding === false) { 
  }

  console.log("scrape button clicked!");
});

$.getJSON("/articles", function (data) {
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /> <a target=_blank href=" + data[i].link + ">" + data[i].link + "</a></p>");
  }
});

$(document).on("click", "p", function () {
  $("#notes").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);

      $("#notes").append("<h5>" + data.title + "</h5>");
      $("#notes").append(`<button type="button" class="btn btn-outline-info btn-sm" data-id=${data._id} id='savearticle'>Save Article</button>`)

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

var savedArticleArray = [];
$(document).on("click", "#savearticle", () => {
  var savedarticle = $("#savearticle").attr('data-id');
  savedArticleArray.push(savedarticle);
  localStorage.setItem("savearticleid", savedArticleArray);

  $.ajax({
    method: "POST",
    url: "/saved-articles/" + savedarticle,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  
});