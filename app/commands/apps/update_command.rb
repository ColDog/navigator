module Apps
  class UpdateCommand < ApplicationCommand

    def command
      Apps::UpdatedEvent.play(params.slice(:app_uid, :name))
    end

  end
end
