/**
 * Created with PyCharm.
 * User: misternando
 * Date: 4/18/13
 * Time: 9:23 PM
 * To change this template use File | Settings | File Templates.
 */

function addEventListeners() {
    $(".statsToggle").click(function(){
        $('.statHeader').slideToggle("slow");
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('#accountStats').css('height','180px');
        }
        else {
            $('#accountStats').css('height','55px');
            $(this).addClass('active');
        }
    });
}

