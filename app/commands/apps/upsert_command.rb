module Apps
  class UpsertCommand < ApplicationCommand

    def command
      if params[:app_uid]
        Apps::UpdatedEvent.play(params)
      else
        params[:app_uid] = SecureRandom.uuid
        Apps::CreatedEvent.play(params)
      end
    end

  end
end
