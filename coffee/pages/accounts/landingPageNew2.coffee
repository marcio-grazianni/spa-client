getCSRF = () ->
  cookies = document.cookie.split(';')
  for i in [0..cookies.length] by 1
    cookie = $.trim(cookies[i]);
    if cookie.substring(0, 'csrftoken'.length + 1) == ('csrftoken' + '=') 
      return decodeURIComponent(cookie.substring('csrftoken'.length + 1))

getJsonFromUrl = (hashBased) ->
  if (hashBased)
    pos = location.href.indexOf("?")
    if pos == -1 then return []
    query = location.href.substr(pos+1)
  else
    query = location.search.substr(1)
  result = {}
  query.split("&").forEach((part) ->
    if(!part) then return
    part = part.replace("+"," ")
    eq = part.indexOf("=")
    key =  if eq>-1 then part.substr(0,eq) else part
    val = if eq>-1 then decodeURIComponent(part.substr(eq+1)) else ""
    from = key.indexOf("[")
    if from == -1 then result[decodeURIComponent(key)] = val
    else
      to = key.indexOf("]")
      index = decodeURIComponent(key.substring(from+1,to))
      key = decodeURIComponent(key.substring(0,from))
      if !result[key] then result[key] = []
      if !index then result[key].push(val) else result[key][index] = val
  )
  return result;

app = {}
csrftoken = getCSRF()

$(document).ready ->
  backScale = ->
    vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    vpHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    convertHeight = ( (720 / 1280) * vpHeight )
    if ( (720 / 1280) * vpWidth )  > vpHeight
      $('#videoHolder').removeClass 'height'
      $('#videoHolder').addClass 'width'
      $('#videoHolder').css('min-height', $('div#landingPageAlpha').height())
      $('div#landingPageAlpha').css('min-height', $('div#landingPageAlpha').height())
    else
      $('#videoHolder').removeClass 'width'
      $('#videoHolder').addClass 'height'
      $('#videoHolder').css('min-height', $('div#landingPageAlpha').height())
      $('div#landingPageAlpha').css('min-height', $('div#landingPageAlpha').height())
  backScale()

  $(window).resize ->
    backScale()

  $("#reserveId").text("#" + (Math.floor(Math.random()*900000) + 100000));

   #Email Validation
  isValidEmailAddress = (emailAddress)  ->
    pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress)

  validatePage2 = ->
    $email = isValidEmailAddress($('input#emailInput').val())
    $fName = ($('input#firstNameInput').val() != '')
    $lName = ($('input#lastNameInput').val() != '')
    $cName = ($('input#companyNameInput').val() != '')
    if $email and $fName and $lName and $cName
      return true
    else
      return false

  $("#alphaPage2 input").keydown ->
    setTimeout( ->
      if validatePage2()
        $("#alphaPage2 form button").removeClass("btn-disabled").prop("disabled", false)
      else
        $("#alphaPage2 form button").addClass("btn-disabled").prop("disabled", true) 
    ,0)

  $("#alphaPage2 input").blur ->
    $email = $(this)
    if validatePage2()
      $("#alphaPage2 form button").removeClass("btn-disabled").prop("disabled", false)
    else
      $("#alphaPage2 form button").addClass("btn-disabled").prop("disabled", true) 

  $.fn.allChange = (callback) -> 
    me = this
    last = ""
    infunc = -> 
      text = $(me).val()
      if validatePage2()
        $("#alphaPage2 form button").removeClass("btn-disabled").prop("disabled", false)
      else
        $("#alphaPage2 form button").addClass("btn-disabled").prop("disabled", true) 
      setTimeout(infunc, 100)
    setTimeout(infunc, 100)

  $("#alphaPage2 input").allChange()

  page2submit = (prePop) ->
    $.post("/beta/", {
      'csrfmiddlewaretoken': csrftoken,
      'email': $("#emailInput").val(),
      'first_name': $("#firstNameInput").val(),
      'last_name': $("#lastNameInput").val(),
      'company': $("#companyNameInput").val(),
      'response': app.response 
    }).success( (response) ->
      if prePop
        $('#alphaPage1').removeClass('active')
        $('div.horizontalDiv').removeClass('active')
      $("span#reservationNumber").text(response.id)
      $('#alphaPage1').hide()
      $('#alphaPage2').addClass('hidden')
      $('#alphaPage3').show()
      setTimeout( ->
        $('#alphaPage3').addClass('active')
      ,1)
      $(".tw").click( () ->
        opts   = ',width='  + 575 +
                 ',height=' + 400 +
                 ',top='    + ($(window).height() - 400) / 2 +
                 ',left='   + ($(window).width()  - 575) / 2
        text = "Join me welcoming email into the age of the customer with @SubscriberVoice, email for brands that listen"
        url = "https://www.subscribervoice.com/beta/t/#{response.id}"
        window.open("https://twitter.com/share?text=#{text}&url=#{url}", 'twitter', opts)
      )
      fb_url = "https://www.subscribervoice.com/beta/f/#{response.id}"
      $(".fb").attr('href', "https://facebook.com/dialog/share?app_id=886556818078922&href=#{fb_url}&display=page&redirect_uri=https://www.subscribervoice.com")
      $("#emailReferral").attr('href',"mailto:?subject=Help give email subscribers a voice&body=You know all those brands that you’re listening to in your inbox – well what if those brands actually listened to you? That’s why I just signed up for SubscriberVoice! Join me: https://www.subscribervoice.com/beta/e/#{response.id}")
    ).error( (response) ->
    )

  $("#alphaPage2 form button").click ->
    page2submit(false)

  jsonURL = getJsonFromUrl(false)
  if jsonURL
    if jsonURL.email
      $('input#emailInput').val(jsonURL.email)
    if jsonURL.firstname
      $('input#firstNameInput').val(jsonURL.firstname)
    if jsonURL.lastname
      $('input#lastNameInput').val(jsonURL.lastname)
    if jsonURL.company
      $('input#companyNameInput').val(jsonURL.company)
  if jsonURL.email and jsonURL.firstname and jsonURL.lastname and jsonURL.company
    $("#alphaPage1 .buttonContainer button").click ->
      $('div.socialStatic').removeClass('active')
    $("#alphaPage1 button#yes").click ->
      app.response = true
      page2submit(true)
    $('#alphaPage1 button#no').click ->
      $('#alphaPage1').removeClass('active')
      $('div.horizontalDiv').removeClass('active')
      $('#alphaPage2 .no').addClass('active')
      $('#alphaPage2').addClass('active')
      app.response = false
  else
    $("#alphaPage1 .buttonContainer button").click ->
      $('#alphaPage1').removeClass('active')
      $('#alphaPage2').addClass('active')
      $('div.socialStatic').removeClass('active')
      $('div.horizontalDiv').removeClass('active')
    $('#alphaPage1 button#yes').click ->
      $('#alphaPage2 .yes').addClass('active')
      app.response = true
    $('#alphaPage1 button#no').click ->
      $('#alphaPage2 .no').addClass('active')
      app.response = false