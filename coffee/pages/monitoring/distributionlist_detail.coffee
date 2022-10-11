$(document).ready ->
  distribution_list =
    new app.models.DistributionList
      id: app.distribution_list_id

  messages = distribution_list.messages
  tags = distribution_list.tags

  distribution_list_view = new app.views.DistributionListView
    el: $('#monitoring')
    collection: messages

  messages.fetch success: ->
    distribution_list_view.initialize_message_views()
    distribution_list_view.render()
    tags.fetch success: ->
      $(".typeahead").typeahead
        source: distribution_list.tags.models.map (tag)->tag.get('text')
    if messages.length
      $("#tags .navButtons span").text("1/#{messages.length}")
    displayCounter = $('.cb:checked').length
    $('li.displayCount p').text("#{displayCounter}/5")
    $('li.displayCount').attr('value',displayCounter)
    if displayCounter == 5
      $(".cbox").not(".active").toggleClass('disabled')
      $(".displayError").hide().removeClass('active')
    else
      $("#submit_tags_and_next").prop("disabled",false).removeClass("btn-disabled")


  $("#updateAlpha").click ->
    $(".alpha.updatePrompt").show()
    $("#alphaOverlay").show()


  $("#tags .navButtons a").click ->
    navButtons = $(this).parent(".navButtons")
    step = navButtons.attr("id")
    stepCounter = navButtons.find("span")
    divLength = (messages.length - 1) * 628
    if $(this).hasClass("right")
      if parseInt(step) == messages.length
        navButtons.attr("id", "1")
        stepCounter.text("1/#{messages.length}")
        $('#messageWrapper').children('div').animate({"top": "0px"},500);
      else
        step = parseInt(step) + 1
        navButtons.attr("id", step)
        stepCounter.text("#{step}/#{messages.length}")
        $('#messageWrapper').children('div').animate({"top": "-=628px"},500);
    else
      if step == "1"
        navButtons.attr("id", "#{messages.length}")
        stepCounter.text("#{messages.length}/#{messages.length}")
        $('#messageWrapper').children('div').animate({"top": "-#{divLength}px"},500);
      else
        step = parseInt(step) - 1
        navButtons.attr("id", step)
        stepCounter.text("#{step}/#{messages.length}")
        $('#messageWrapper').children('div').animate({"top": "+=628px"},500);

