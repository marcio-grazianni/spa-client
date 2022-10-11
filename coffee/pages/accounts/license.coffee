isValidPassword = (password)  ->
  pattern = new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{8,128}$")
  return pattern.test(password)

$(document).ready ->

  allSet = ->
    fname = ($("input#first-name").val() != '')
    lname = ($("input#last-name").val() != '')
    pw = isValidPassword($("input#pw").val())
    confirm = ($("input#pw").val() == $("input#confirm").val())
    return (fname and lname and pw and confirm)

  $("input#tos").change ->
    if $(this).attr("checked")
      $("button#licenseContinue").removeClass("btn-disabled").prop("disabled", false)
    else
      $("button#licenseContinue").addClass("btn-disabled").prop("disabled", true)
  
  $("button#licenseContinue").click ->
    if $(this).hasClass("btn-disabled")
      return false
    else
      $("div#license").hide()
      $("div#password").show()
      $("ul.steps li#step1").removeClass("active").addClass("complete")
      $("ul.steps li#step2").addClass("active")
      $("ul.steps div.progress").css({width: "50%"})

  $("input#first-name").keyup ->
    if $(this).val() != ''
      if allSet()
        $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
    else
      $("#fnCorrect").addClass("hidden")
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)

  $("input#last-name").keyup ->
    if $(this).val() != ''
      if allSet()
        $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
    else
      $("#lnCorrect").addClass("hidden")
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)

  $("input#pw").keyup ->
    pw = $(this).val()
    if isValidPassword(pw)
      if $("input#confirm").attr("value") == pw
        if allSet()
          $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
      else
        $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)
    else
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)


  $("input#confirm").keyup ->
    pwValue = $("input#pw").val()
    if isValidPassword(pwValue)
      if $(this).val() == pwValue
        if allSet()
          $("input[type='submit']").removeClass("btn-disabled").prop("disabled", false)
      else
        $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)
    else
      $("input[type='submit']").addClass("btn-disabled").prop("disabled", true)
  
  $("input[type='submit']").click ->
    if $(this).hasClass("btn-disabled")
      return false

