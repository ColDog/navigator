module Apps
  class DeleteCommand < ApplicationCommand

    def command
      Apps::DeletedEvent.play(params)
    end

  end
end
