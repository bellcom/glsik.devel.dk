$(document).ready(function(){


    $('.fancybox-media').fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        helpers : {
            media : {}
        }
    });

    $(".app-iphone").click(function() {
        $('.app-iphone').toggleClass("active");
        $('.app-android').animate("fast");
        $('.app-android').removeClass("active");
    });

    $(".app-android").click(function() {
        $('.app-android').toggleClass("active");
        $('.app-iphone').animate("fast");
        $('.app-iphone').removeClass("active");
    });

});