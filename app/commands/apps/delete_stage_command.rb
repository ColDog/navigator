module Apps
  class DeleteStageCommand < ApplicationCommand

    def command
      Apps::StageDeletedEvent.play(params)
    end

  end
end
