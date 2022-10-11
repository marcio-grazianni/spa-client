#sets up the application namespaces
window.app ?=
  controllers: {}
  views: {}
  models: {}
  collections: {}
  routers: {}

window.utils ?= {}

window.templates ?= {}

window.app.add_event_listeners = ->


$ ->
  window.app.add_event_listeners()
