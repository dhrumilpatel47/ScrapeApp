$(document).ready(function () {
    var allSavedArticles = localStorage.getItem('savearticleid');
    var allSavedArticlesArray = allSavedArticles.split(',');
    jsonArticles = [];

    for (var i = 0; i < allSavedArticlesArray.length; i++) {
        jsonArticles.push({ id: allSavedArticlesArray[i] });
    }

    console.log(`json object:  ${JSON.stringify(jsonArticles)}`);
        $.getJSON("/all/saved-articles", function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
              $(".wrap").append(`<div class="jumbotron jumbotron-fluid "><div class="container"><h1 class="display-4 title-value">${data[i].title}</h1> 
              <p class="lead body-value"><a href=${data[i].link}>${data[i].link}</a></p>
              </div>
              <button type="button" class="btn btn-outline-danger ml-3 delete-button" data-id=${data[i]._id}>Delete</button> </div>`);
            }
          });

    $(document).on("click", ".delete-button", function(){
        var id = $(this).attr("data-id");
        $.ajax("/api/saved-articles/" + id, {
            type: "DELETE"
        }).then(
            function () {
                location.reload();
            }
        );
    });
});