module Apps
  class CreateCommand < ApplicationCommand

    def command
      params[:app_uid] = SecureRandom.uuid
      Apps::CreatedEvent.play(params)
    end

  end
end
