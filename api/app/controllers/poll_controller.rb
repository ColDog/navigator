class PollController < ApplicationController

  def poll
    render json: { latest: Event.maximum(:created_at) }
  end

end
