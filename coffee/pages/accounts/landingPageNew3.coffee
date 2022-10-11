isValidEmailAddress = (emailAddress)  ->
  pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i)
  return pattern.test(emailAddress)

isValidPassword = (password) ->
  pattern = new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{8,128}$")
  return pattern.test(password)

getCSRF = () ->
  cookies = document.cookie.split(';')
  for i in [0..cookies.length] by 1
    cookie = $.trim(cookies[i])
    if cookie.substring(0, 'csrftoken'.length + 1) == ('csrftoken' + '=')
      return decodeURIComponent(cookie.substring('csrftoken'.length + 1))

createCookie = (name,value,days) ->
  if days
    date = new Date()
    date.setTime(date.getTime()+(days*24*60*60*1000))
    expires = "; expires="+date.toGMTString()
  else
    expires = ""
  document.cookie = name+"="+value+expires+"; path=/"

readCookie = (name) ->
  nameEQ = name + "="
  ca = document.cookie.split(';')
  for c in ca
    while (c.charAt(0)==' ')
      c = c.substring(1,c.length)
    if (c.indexOf(nameEQ) == 0)
      return c.substring(nameEQ.length,c.length)
  return null

  eraseCookie = (name) ->
    createCookie(name,"",-1)

isElementInViewport = (el) ->
  if (typeof jQuery == "function" && el instanceof jQuery)
    el = el[0]

  rect = el.getBoundingClientRect()
  scrollTop = $(window).scrollTop()
  return (
    (rect.top + 50) <= scrollTop
  )

onVisibilityChange = (el, callback) ->
  old_visible = false
  return ( ->
    visible = isElementInViewport(el)
    if (visible != old_visible)
      old_visible = visible
      if (typeof callback == 'function')
        callback()
  )

vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

if window.location.hash
  if window.location.hash == "get-started" or window.location.hash == "#get-started" or window.location.hash == "get-started/" or window.location.hash == "#get-started/"
    if vpWidth > 992
      $("#alphaOverlay").show()
      $("#alphaOverlay").addClass("active")
      $("div.upgrade-wrapper").show()
      $("div.upgrade-wrapper").addClass("active")
      

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) or vpWidth <= 992
  mobile = true
else
  mobile = false



$(window).bind('scroll', (e) ->
  val = $(this).scrollTop()
  $header = $("header.landingPage:not(.pre-scrolled)")
  $mobileNav = $('nav.mobile')
  if val > 25
    if $header.hasClass("notScrolled")
      $header.removeClass("notScrolled").addClass("scrolled")
      $mobileNav.removeClass("notScrolled").addClass("scrolled")
  else if val < 25
    if $header.hasClass("scrolled")
      $header.removeClass("scrolled").addClass("notScrolled")
      $mobileNav.removeClass("scrolled").addClass("notScrolled")
)

$('div.mobile-toggle button').click ->
  $('nav.mobile').toggleClass('is-visible')
  $('header').toggleClass('mobile-nav-toggled')

$('a.link.request-demo').click ->
  $('nav.mobile').toggleClass('is-visible')
  $('header').toggleClass('mobile-nav-toggled')
  location.href = "#"
  location.href = "#get-started"

slideTestimonial = ->
  $active = $('ul.testimonials.users li.active')
  $activeCirc = $('ul.circle-nav li.active')
  if $active.val() != 6
    $new = $active.next('li')
    $newCirc = $activeCirc.next('li')
  else
    $new = $('ul.testimonials.users li[value="1"]')
    $newCirc = $('ul.circle-nav li[value="1"]')
  $active.removeClass('active')
  $new.addClass('active')
  $activeCirc.removeClass('active')
  $newCirc.addClass('active')

slideInterval = window.setInterval(slideTestimonial, 7700)

$("ul.circle-nav li i.fa-circle").click ->
  $new = $(this).parents("li")
  $active = $("ul.circle-nav li.active")
  newValue = $new.val()
  $active.removeClass("active")
  $new.addClass("active")
  $("ul.testimonials.users li.active").removeClass("active")
  $("ul.testimonials.users li[value='#{newValue}']").addClass("active")
  clearInterval(slideInterval)
  slideInterval = window.setInterval(slideTestimonial, 7700)

$('ul.trust-values li').hover( ->
  $(this).addClass('flip')
->
  $(this).removeClass('flip')
)

validateGetStarted = ->
  $first_name = ($('input#first-name').val() != '')
  $last_name = ($('input#last-name').val() != '')
  $email = isValidEmailAddress($('input#email').val())
  if $first_name and $last_name and $email
    return true
  else
    return false

validateContactUs = ->
  $first_name = ($('input#first-name').val() != '')
  $last_name = ($('input#last-name').val() != '')
  $email = isValidEmailAddress($('input#email').val())
  $phone = ($('input#phone').val() != '')
  $message = ($('textarea#message').val() != '')
  if $first_name and $last_name and $email and $phone and $message
    return true
  else
    return false

$("form.contact-us .input").keydown ->
  setTimeout( ->
    if validateContactUs()
      $("form button").removeClass("btn-disabled").prop("disabled", false)
    else
      $("form button").addClass("btn-disabled").prop("disabled", true) 
  ,0)

$("form.contact-us .input").blur ->
  if validateContactUs()
    $("form button").removeClass("btn-disabled").prop("disabled", false)
  else
    $("form button").addClass("btn-disabled").prop("disabled", true)

characters = 1000
$("textarea#message").keyup ->
  if ($(this).val().length > characters)
    $(this).val($(this).val().substr(0, characters))
  remaining = characters -  $(this).val().length
  $("#commentCounter p").remove()
  if(remaining <= 10)
    $("#commentCounter").append("<p><strong>"+  remaining+"</strong> characters remaining</p>")

$.fn.allChange = (callback) ->
  me = this
  last = ""
  infunc = ->
    text = $(me).val()
    if contact_us
      validate = validateContactUs()
    else
      validate = validateGetStarted()
    if validate
      $("form.lp button").removeClass("btn-disabled").prop("disabled", false)
    else
      $("form.lp button").addClass("btn-disabled").prop("disabled", true)
    setTimeout(infunc, 100)
  setTimeout(infunc, 100)

characters = 1000
$("textarea#message").keyup ->
  if ($(this).val().length > characters)
    $(this).val($(this).val().substr(0, characters))
  remaining = characters -  $(this).val().length
  $("#commentCounter p").remove()
  if(remaining <= 10)
    $("#commentCounter").append("<p><strong>"+  remaining+"</strong> characters remaining</p>")

getQueryVariable = (variable) ->
  query = window.location.search.substring(1)
  vars = query.split('&')
  for v in vars
    pair = v.split('=')
    if decodeURIComponent(pair[0]) == variable
      return decodeURIComponent(pair[1])
  return false

if app.exitSurvey and getQueryVariable("show") == "success"
  $("#alphaOverlay").addClass("active")
  $(".survey-popup").addClass("active")
  $("#alphaOverlay").show()
  $(".survey-popup").show()

if $('form.get-started').length > 0
  emailPrePopulated = getQueryVariable("email")
  if emailPrePopulated
    $("input#email").val(emailPrePopulated)

inputArray = [
  'first-name'
  'last-name'
  'email'
  'password'
]

setError = (inputID, message) ->
  inputDiv = $("div.input-wrapper.#{inputID}")
  inputDiv.find('span').remove()
  inputDiv.append("<span class='error'>#{message}</span>")
  inputDiv.find("input").addClass("error")

clearError = (inputID) ->
  inputDiv = $("div.input-wrapper.#{inputID}")
  errorDiv = inputDiv.find("span")
  if errorDiv then errorDiv.remove()
  inputDiv.find("input").removeClass("error")

clearAllErrors = ->
  for inputID in inputArray
    inputDiv = $("div.input-wrapper.#{inputID}")
    errorDiv = inputDiv.find("span")
    if errorDiv then errorDiv.remove()
    inputDiv.find("input").removeClass("error")

validateInput = (inputID) ->
  value = $("input##{inputID}").val()
  switch inputID
    when 'first-name'
      if value != ""
        return true
      else
        return 'Must add first name.'
    when 'last-name'
      if value != ""
        return true
      else
        return 'Must add last name.'
    when 'company'
      if value.length > 20
        return "Company name must be 20 characters or less."
      else if value != ""
        return true
      else
        return "Must add your company's name."
    when 'email'
      if not isValidEmailAddress(value) or value == ""
        return 'Must add email address.'
      else
        return true
    when 'password'
      if value == "" then return "Must add password."
      else if value.length < 8 then return "Password must be at least 8 characters."
      else if not isValidPassword(value) then return "Password must contain at least 1 number and 1 letter."
      else return true

$("form.get-started input").on("keyup blur", ->
  inputID = $(this).attr('id')
  value = $(this).val()
  $("form.get-started").removeClass("submitted")
  if value == "" and not $(this).hasClass("edited")
    return false
  else if not $(this).hasClass("edited")
    $(this).addClass("edited")
  setTimeout( ->
    validation = validateInput(inputID)
    if validation == true
      clearError(inputID)
    else if $("form.get-started").hasClass("submitted")
      setError(inputID, validation)
  ,0)
)
  
$("form.get-started").submit (e) ->
  e.preventDefault()
  $(this).addClass("submitted")
  csrftoken = $("form.get-started input[name='csrfmiddlewaretoken']").val()
  from = getQueryVariable("from")
  if from then referrer = from else referrer = "unknown"
  first_name = $("input#first-name").val()
  last_name = $("input#last-name").val()
  company = $("input#company").val()
  email = $("input#email").val()
  password = $("input#password").val()
  clearAllErrors()
  errors = {}
  isError = false

  if not first_name then errors['first-name'] = 'Must add first name.'
  if not last_name then errors['last-name'] = 'Must add last name.'

  if not company then errors['company'] = "Must add your company's name."
  else if company.length > 20 then errors['company'] = "Company name must be 20 characters or less."
  if not email then errors['email'] = 'Must add email address.'
  else if not isValidEmailAddress(email) then errors['email'] = 'Must add email address.'

  if not password then errors['password'] = 'Must add password.'
  else if password.length < 8 then errors['password'] = "Password must be at least 8 characters."
  else if not isValidPassword(password) then errors['password'] = "Password must contain at least 1 number and 1 letter."

  for input, error of errors
    input_wrapper = $("div.#{input}.input-wrapper")
    input_wrapper.append("<span class='error'>#{error}</span>")
    input_wrapper.find("input").addClass('error')
    isError = true
  if isError then return false

  $.post("/get-started-submit/", {
    'csrfmiddlewaretoken': csrftoken,
    'first_name': first_name,
    'last_name': last_name,
    'company': company,
    'email': email,
    'password': password,
    'referrer': referrer,
    'mobile': mobile
  }).success( (response) ->
    # $("div.form-wrapper").hide()
    # $("form.get-started").append("<h2 class='thank-you'>Thanks for signing up!</h2>")
    # $("form.get-started").append("<p class='thank-you'>You'll receive an email to confirm your reservation</p>")
    if response.errors
      for k, error of response.errors
        switch k
          when 'first_name' then input = 'first-name'
          when 'last_name' then input = 'last-name'
          when 'company_name' then input = 'company'
          when 'username' then input = 'email'
          else input = k
        input_wrapper = $("div.#{input}.input-wrapper")
        input_wrapper.append("<span class='error'>#{error}</span>")
        input_wrapper.find("input").addClass('error')
    else if response.success
      try
        __adroll.record_user({"adroll_segments": "2cbecbf7"})
      fbq('track', 'CompleteRegistration')
      createCookie('svsignup','true',90)
      if mobile
        wrapperHeight = $("div.form-wrapper").height()
        $("div.mobile.success").height(wrapperHeight)
        $("div.form-wrapper").removeClass('active')
        setTimeout( ->
          $("div.form-wrapper").hide()
          $("div.mobile.success").show().addClass("active")
        , 1000)
      else
        window.location.href = '/dashboard/'
  ).error( (response) ->
    )

$("form.contact-us").submit (e) ->
  e.preventDefault()
  csrftoken = $("form.contact-us input[name='csrfmiddlewaretoken']").val()
  $.post("/contact-us-submit/", {
      'csrfmiddlewaretoken': csrftoken,
      'first_name': $("input#first-name").val(),
      'last_name': $("input#last-name").val(),
      'email': $("input#email").val(),
      'phone': $("input#phone").val(),
      'message': $("textarea#message").val()
    }).success( (response) ->
      $("div.form-wrapper").hide()
      $("form.contact-us").append("<h2 class='thank-you'>Thanks!</h2>")
      $("form.contact-us").append("<p class='thank-you'>We'll be in touch soon.</p>")
      fbq('track', 'Lead')
    ).error( (response) ->
    )

if $("form.contact-us").length > 0
  contact_us = true
  $("form.contact-us .input").allChange()
else
  contact_us = false

if app.exitSurvey and not mobile and not readCookie("svsignup")
  $(document).one('mouseleave', (e) ->
    if e.clientY < 60
      $("#alphaOverlay").show()
      $("#alphaOverlay").addClass("active")
      $(".survey-popup").show()
      $(".survey-popup").addClass("active")
  )


$('button.request-demo').click ->
  if vpWidth > 992
    $("#alphaOverlay").show()
    $("#alphaOverlay").addClass("active")
    $("div.upgrade-wrapper").show()
    $("div.upgrade-wrapper").addClass("active")
  else
    location.href = "#"
    location.href = "#get-started"


$("button.assets").click ->
  $("#alphaOverlay").show()
  $("#alphaOverlay").addClass("active")
  $("div.assets-popup").show()
  $("div.assets-popup").addClass("active")


$('.closeForm').click ->
  $("#alphaOverlay").removeClass("active").removeClass('close-landing-alpha')
  $("div.survey-popup").removeClass("active")
  $("div.assets-popup").removeClass("active")
  $("div.upgrade-wrapper").removeClass("active")
  setTimeout( ->
    $("#alphaOverlay").hide()
    $("div.survey-popup").hide()
    $("div.assets-popup").hide()
    $("div.upgrade-wrapper").hide()
  , 1000)

$('div.hover-circle').mouseenter ->
  $(this).next('div.hover-tooltip').addClass('hovered')

$('div.circle-wrapper').mouseleave ->
  if not $(this).find('div.hover-tooltip').hasClass('hovered')
    return false
  removeTipTimer = setTimeout( =>
    $(this).find('div.hover-tooltip').removeClass('hovered')
  , 3000)
  $(this).one('mouseenter', ->
    clearTimeout(removeTipTimer)
  )

# For Old exit Intent

# $("div#page-1 button").click ->
#   $("div#page-1").removeClass("active")
#   setTimeout( ->
#     $("div#page-1").hide()
#     $("div#page-2").show()
#     $("div#page-2").addClass("active")
#   ,1000)
#   answer = $(this).attr("id")
#   if answer == "yes" then app.response = true else app.response = false
#   $("div#page-2").addClass(answer)

validatePage2 = ->
  $fName = ($('div#page-2 input#firstNameInput').val() != '')
  $lName = ($('div#page-2 input#lastNameInput').val() != '')
  $email = isValidEmailAddress($('div#page-2 input#emailInput').val())
  if $email and $fName and $lName
    return true
  else
    return false

$("div#page-2 input").keydown ->
  setTimeout( ->
    if validatePage2()
      $("div#page-2 form button").removeClass("btn-disabled").prop("disabled", false)
    else
      $("div#page-2 form button").addClass("btn-disabled").prop("disabled", true) 
  ,0)

$("div#page-2 input").blur ->
  $email = $(this)
  if validatePage2()
    $("div#page-2 form button").removeClass("btn-disabled").prop("disabled", false)
  else
    $("div#page-2 form button").addClass("btn-disabled").prop("disabled", true) 

$.fn.formChange = (callback) ->
  infunc = ->
    if validatePage2()
      $("div#page-2 form button").removeClass("btn-disabled").prop("disabled", false)
    else
      $("div#page-2 form button").addClass("btn-disabled").prop("disabled", true) 
    setTimeout(infunc, 100)
  setTimeout(infunc, 100)

$("div#page-2 input").formChange()

close_bounce_survey = ->
  $("#alphaOverlay").removeClass('active')
  $("div.survey-popup").removeClass('active')
  $("div.popup-logo").removeClass('active')
  $(document).unbind('mouseleave')
  setTimeout( ->
    $("#alphaOverlay").hide()
    $("div.survey-popup").hide()
    $("div.popup-logo").hide()
  , 1000)

$("div#page-3 div.close").click ->
  close_bounce_survey()

abandonAndClose = ->
  try
    __adroll.record_user({"adroll_segments": "9213c9e8"})
  close_bounce_survey()


$("div.close.abandon").click ->
  abandonAndClose()
  
$("div#page-2 span.no-thanks p").click ->
  abandonAndClose()

bounce_survey_submit = ->
  csrftoken = $("form#reservationForm input[name='csrfmiddlewaretoken']").val()
  $.post("/bounce/", {
    'csrfmiddlewaretoken': csrftoken,
    'first_name': $("#firstNameInput").val(),
    'last_name': $("#lastNameInput").val(),
    'email': $("#emailInput").val(),
    'referrer': app.location,
    'response': app.response
  }).success( (response) ->
    # $("span#reservationNumber").text(response.id)
    $("div#page-2").removeClass("active")
    setTimeout( ->
      $("div#page-2").hide()
      $("div#page-3").show()
      $("div#page-3").addClass("active")
    ,1000)
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
    try
      __adroll.record_user({"adroll_segments": "2cbecbf7"})
    createCookie('svsignup','true',90)
    fbq('track', 'Lead')
  ).error( (response) ->
  )

$("div.survey-popup form#reservationForm").submit (e) ->
  e.preventDefault()
  if $(this).find("button").hasClass("btn-disabled")
    return false
  bounce_survey_submit()

$("input#id_username").attr('placeholder', 'Email Address')
$("input#id_email").attr('placeholder', 'Email Address')

$("input#id_password").attr('placeholder', 'Password')
$("input#id_new_password1").attr('placeholder', 'New Password')
$("input#id_new_password2").attr('placeholder', 'Confirm New Password')

$( ->
  $("span.title").typed({
    strings: ["Email marketing", "Email newsletters", "Content marketing"]
    typeSpeed: 70
    backDelay: 3500
    loop: true
  })
)

appSlider = $("ul.app-selector.desktop").lightSlider({
  item: 4
  pager: false
  enableTouch: false
  enableDrag: false
  freeMove: false
  speed: 1000,
  responsive : []
  onSliderLoad: ->
    $('ul.app-selector.desktop').removeClass('cs-hidden')
})

fadeToggle = (hideID, showID) ->
  $("div#section-#{hideID}").removeClass('active')
  $("div#section-#{hideID}").hide()
  $("div#section-#{showID}").show()
  $("div#section-#{showID}").addClass("active")

selectorToggle = (inactiveID, activeID) ->
  $("ul li#select-#{inactiveID}").removeClass('selected')
  $("ul li#select-#{inactiveID} button").removeClass('selected')
  $("ul li#select-#{activeID}").addClass('selected')
  $("ul li#select-#{activeID} button").addClass('selected')

$('ul.selector li button').click ->
  contentSection = $(this).parents('div.content-section')
  if $(this).hasClass('selected') then return false
  hideID = contentSection.find('div.section-toggle.active').attr('id').substring(8)
  showID = $(this).parents('li').attr('id').substring(7)
  selectorToggle(hideID, showID)
  fadeToggle(hideID, showID)
  if contentSection.hasClass('app-section')
    slideIndex = parseInt($(this).parents('li').attr('data-slide'))
    slideCount = (appSlider.getCurrentSlideCount() - 1)
    slideDestination = Math.min((slideIndex - 1), 2)
    if slideDestination < 0
      slideDestination = 0
    if slideCount == 0
      if slideIndex >= 2
        appSlider.goToSlide(slideDestination)
    if slideCount == 1
      if slideIndex <= 1 or slideIndex >= 3
        appSlider.goToSlide(slideDestination)
    if slideCount == 2
      if slideIndex <= 2
        appSlider.goToSlide(slideDestination)

$("form.get-started input").on("keyup blur", ->
  inputID = $(this).attr('id')
  value = $(this).val()
  $("form.get-started").removeClass("submitted")
  if value == "" and not $(this).hasClass("edited")
    return false
  else if not $(this).hasClass("edited")
    $(this).addClass("edited")
  setTimeout( ->
    validation = validateInput(inputID)
    if validation == true
      clearError(inputID)
    else if $("form.get-started").hasClass("submitted")
      setError(inputID, validation)
  ,0)
)

$("div.inputWrapper input").on("keyup blur", ->
  $(this).parents("div.inputWrapper").removeClass('error')
)


$("form#request-popup-form input").on("keyup blur", ->
  $(this).removeClass('error')
)

$('form#request-popup-form').submit (e) ->
  e.preventDefault()
  csrftoken = $("form.emailForm input[name='csrfmiddlewaretoken']").val()
  form = $('form#request-popup-form')
  name = form.find('input#popup-name-field').val()
  email = form.find('input#popup-email-field').val()
  company = form.find('input#popup-company-field').val()
  inputs = form.find('input')
  inputs.removeClass('error')
  error = false
  if not name
    error = true
    form.find('input#popup-name-field').addClass('error')
  if not email or not isValidEmailAddress(email)
    error = true
    form.find('input#popup-email-field').addClass('error')
  if not company
    error = true
    form.find('input#popup-company-field').addClass('error')
  if error then return false
  $.post("/get-started-email/", {
    'csrfmiddlewaretoken': csrftoken,
    'name': name,
    'email': email,
    'company_name': company
  }).success( (response) ->
    if response.errors
      inputWrapper.addClass('error')
    if response.success
      try
        __adroll.record_user({"adroll_segments": "2cbecbf7"})
      fbq('track', 'Lead')
      createCookie('svsignup','true',90)
      $('form#request-popup-form').hide()
      $('div.upgrade-wrapper div.success').show().addClass('active')
  ).error( (response) ->
    inputWrapper.addClass('error')
  )

$('div.get-started-banner form.emailForm').submit (e) ->
  e.preventDefault()
  csrftoken = $("form.emailForm input[name='csrfmiddlewaretoken']").val()
  form = $('form.emailForm')
  name = form.find('input.nameInput').val()
  email = form.find('input.emailInput').val()
  company = form.find('input.companyInput').val()
  inputWrapper = form.find('form.emailForm div.inputWrapper')
  inputWrapper.removeClass('error')
  error = false
  if not name
    error = true
    $('form.emailForm div.inputWrapper.name').addClass('error')
  if not email or not isValidEmailAddress(email)
    error = true
    $('form.emailForm div.inputWrapper.email').addClass('error')
  if not company
    error = true
    $('form.emailForm div.inputWrapper.company').addClass('error')
  if error then return false
  $.post("/get-started-email/", {
    'csrfmiddlewaretoken': csrftoken,
    'name': name,
    'email': email,
    'company_name': company

  }).success( (response) ->
    if response.errors
      inputWrapper.addClass('error')
    if response.success
      try
        __adroll.record_user({"adroll_segments": "2cbecbf7"})
      fbq('track', 'Lead')
      createCookie('svsignup','true',90)
      $('div.get-started-wrapper h3.prompt').hide()
      $('div.get-started-wrapper form.emailForm').hide()
      $('div.get-started-wrapper div.success').show().addClass('active')
  ).error( (response) ->
    inputWrapper.addClass('error')
  )

$('form.request-demo-email').submit (e) ->
  e.preventDefault()
  csrftoken = $("form.emailForm input[name='csrfmiddlewaretoken']").val()
  form = $('form.request-demo-email')
  email = form.find('input').val()
  company = form.find('input.companyInput').val()
  error = false
  if not email or not isValidEmailAddress(email)
    error = true
    form.find('input').addClass('error')
  if error then return false
  $.post("/request-demo-email/", {
    'csrfmiddlewaretoken': csrftoken,
    'email': email,
  }).success( (response) ->
    if response.errors
      inputWrapper.addClass('error')
    if response.success
      try
        __adroll.record_user({"adroll_segments": "2cbecbf7"})
      fbq('track', 'Lead')
      createCookie('svsignup','true',90)
    if vpWidth > 992
      $("#alphaOverlay").show()
      $("#alphaOverlay").addClass("active")
      $("div.upgrade-wrapper").show()
      $("div.upgrade-wrapper").addClass("active")
      $("form#request-popup-form input#popup-email-field").val(email)
    else
      location.href = "#"
      location.href = "#get-started"
      $("div.get-started-banner form.emailForm input.emailInput").val(email)
  ).error( (response) ->
    inputWrapper.addClass('error')
  )

$('form#emailForm button').click ->
  form = $(this).parents('form.emailForm')
  form.addClass("submitted")
  csrftoken = $("form#emailForm input[name='csrfmiddlewaretoken']").val()
  email = form.find('input.emailInput').val()
  inputWrapper = form.find('div.inputWrapper')
  inputWrapper.removeClass('error')
  error = false
  if not email or not isValidEmailAddress(email) then error = true
  if error
    inputWrapper.addClass('error')
    return false
  $.post("/case-study-email/", {
    'csrfmiddlewaretoken': csrftoken,
    'email': email
  }).success( (response) ->
    if response.errors
      inputWrapper.addClass('error')
    if response.success
      try
        __adroll.record_user({"adroll_segments": "2cbecbf7"})
      fbq('track', 'Lead')
      createCookie('svsignup','true',90)
      $("div.story-form").removeClass("active")
      divHeight = $("div.story-form").height()
      $("div.story-thanks").height(divHeight)
      setTimeout( ->
        $("div.story-form").hide()
        $("div.story-thanks").show().addClass("active")
      , 1000)
  ).error( (response) ->
    inputWrapper.addClass('error')
  )

$('form#emailForm').submit (e) ->
  e.preventDefault()
  $(this).addClass("submitted")
  csrftoken = $("form#emailForm input[name='csrfmiddlewaretoken']").val()
  email = $(this).find('input.emailInput').val()
  inputWrapper = $(this).find('div.inputWrapper')
  inputWrapper.removeClass('error')
  error = false
  if not email or not isValidEmailAddress(email) then error = true
  if error
    inputWrapper.addClass('error')
    return false
  $.post("/case-study-email/", {
    'csrfmiddlewaretoken': csrftoken,
    'email': email
  }).success( (response) ->
    if response.errors
      inputWrapper.addClass('error')
    if response.success
      try
        __adroll.record_user({"adroll_segments": "2cbecbf7"})
      fbq('track', 'Lead')
      createCookie('svsignup','true',90)
      $("div.story-form").removeClass("active")
      divHeight = $("div.story-form").height()
      $("div.story-thanks").height(divHeight)
      setTimeout( ->
        $("div.story-form").hide()
        $("div.story-thanks").show().addClass("active")
      , 1000)
  ).error( (response) ->
    inputWrapper.addClass('error')
  )

#if we ever bring back the donut graphs... use this...
#
# if app.landingPage == true
#   width = 220
#   height = 220
#   radius = Math.min(width, height) / 1.5

#   opacities = [1, 0]

#   tau = 2 * Math.PI

#   donut_dataset =
#     churn: [0, 0.86]
#     # churn: [0, 1, 0.86]
#     opens: [0, 0.67]
#     conversions: [0, 0.57]

#   pie = d3.layout.pie()
#     .sort(null)

#   bgSet = {}

#   donutSet = {}

#   arc = d3.svg.arc()
#     .innerRadius(radius - 60)
#     .outerRadius(radius - 57)
#     .startAngle(0)
#     .cornerRadius(20)

#   arcWide = d3.svg.arc()
#     .innerRadius(radius - 61)
#     .outerRadius(radius - 56)
#     .startAngle(0)
#     .cornerRadius(20)

#   arcTween = (transition, newAngle, currArc, callback) ->
#     if not callback
#       callback = ->
#     if transition.size() == 0
#       callback()
#     n = 0
#     transition
#       .attrTween("d", (d) ->
#         interpolate = d3.interpolate(d.endAngle, newAngle)
#         return (t) ->
#           d.endAngle = interpolate(t)
#           return currArc(d)
#       )
#       .each( ->
#         n += 1
#       )
#       .each("end", ->
#         n -= 1
#         if n == 0
#           callback.apply(this, arguments)
#       )

#   churnTotal = 14
#   opensTotal = 67
#   conversionsTotal = 57

#   for key of donut_dataset
#     bgSet[key] = d3.select("div##{key}GraphBG.donut-graph-bg").append("svg")
#       .attr("width", width)
#       .attr("height", height)
#       .append("g")
#       .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate(225)")
#     bgSet[key].selectAll("path")
#       .data(pie([270, 90]))
#       .enter().append("path")
#       .attr("fill", '#c1cae2')
#       .attr("opacity", (d, i) -> return opacities[i])
#       .attr("d", arc)
#     donutSet[key] = d3.select("div##{key}Graph.donut-graph").append("svg")
#       .attr("width", width)
#       .attr("height", height)
#       .append("g")
#       .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate(225)")
#     path = donutSet[key].append("path")
#       .datum({
#         endAngle: (donut_dataset[key][1] * tau * 0.75)
#       })
#       .attr("fill", '#4192b6')
#       .attr("opacity", (d, i) -> return opacities[i])
#       .attr("d", arcWide)

  # #set all nums to 0
  # $("span.num").text("0")
    


  # endNumAnimation = (intervalID, $num, total) ->
  #   window.clearInterval(intervalID)
  #   $num.text(total)

  # handlerChurn = onVisibilityChange($("div#churnGraph.donut-graph"), ->
  #   secs = (3 / 100) * 1000
  #   count = 0
  #   $num = $('div.churn span.num')
  #   intervalID = setInterval( ->
  #     if count == 100
  #       window.clearInterval(intervalID)
  #       $num.text(churnTotal)
  #       return
  #     random = Math.round((Math.random() * (99 - 10)) + 10)
  #     $num.text(random)
  #     count += 1
  #   , secs)
  #   donutSet['churn']
  #     .select("path")
  #     .transition()
  #     .duration(1900)
  #     .call(arcTween, (donut_dataset['churn'][1] * tau * 0.75), arcWide)
  #   window.setTimeout( ->
  #     donutSet['churn']
  #       .select("path")
  #       .transition()
  #       .duration(1000)
  #       .call(arcTween, (donut_dataset['churn'][2] * tau * 0.75), arcWide, ->endNumAnimation(intervalID, $num, churnTotal)
  #       )
  #   , 2500)
  #   $(window).off('DOMContentLoaded.churn load.churn resize.churn scroll.churn')
  # )

  # $(window).on('DOMContentLoaded.churn load.churn resize.churn scroll.churn', handlerChurn)

  # handlerOpens = onVisibilityChange($("div#opensGraph.donut-graph"), ->
  #   secs = (3 / 100) * 1000  
  #   count = 0
  #   $num = $('div.opens span.num')
  #   intervalID = setInterval( ->
  #     if count == 100
  #       window.clearInterval(intervalID)
  #       $num.text(opensTotal)
  #       return
  #     random = Math.round((Math.random() * (99 - 10)) + 10)
  #     $num.text(random)
  #     count += 1
  #   , secs)
  #   donutSet['opens']
  #     .select("path")
  #     .transition()
  #     .duration(3000)
  #     .call(arcTween, (donut_dataset['opens'][1] * tau * 0.75), arcWide, ->
  #       endNumAnimation(intervalID, $num, opensTotal)
  #     )
  #   $(window).off('DOMContentLoaded.opens load.opens resize.opens scroll.opens')
  # )

  # $(window).on('DOMContentLoaded.opens load.opens resize.opens scroll.opens', handlerOpens)

  # handlerConversions = onVisibilityChange($("div#conversionsGraph.donut-graph"), ->
  #   secs = (3 / conversionsTotal) * 1000 
  #   count = 0
  #   $num = $('div.conversions span.num')
  #   intervalID = setInterval( ->
  #     if count == 100
  #       window.clearInterval(intervalID)
  #       $num.text(conversionsTotal)
  #       return
  #     random = Math.round((Math.random() * (99 - 10)) + 10)
  #     $num.text(random)
  #     count += 1
  #   , secs)
  #   donutSet['conversions']
  #     .select("path")
  #     .transition()
  #     .duration(3000)
  #     .call(arcTween, (donut_dataset['conversions'][1] * tau * 0.75), arcWide, ->
  #       endNumAnimation(intervalID, $num, conversionsTotal)
  #     )
  #   $(window).off('DOMContentLoaded.conversions load.conversions resize.conversions scroll.conversions')
  # )

  # $(window).on('DOMContentLoaded.conversions load.conversions resize.conversions scroll.conversions', handlerConversions)