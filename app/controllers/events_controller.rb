class EventsController < ApplicationController
  def index
    @events = Event.all.last(50).reverse
  end
end
