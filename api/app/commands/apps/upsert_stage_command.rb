module Apps
  class UpsertStageCommand < ApplicationCommand

    def command
      if params[:stage_uid]
        Apps::StageUpdatedEvent.play(params)
      else
        params[:stage_uid] = SecureRandom.uuid
        Apps::StageCreatedEvent.play(params)
      end
    end

  end
end
