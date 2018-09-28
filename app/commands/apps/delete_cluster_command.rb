module Apps
  class DeleteClusterCommand < ApplicationCommand

    def command
      Apps::ClusterDeletedEvent.play(params)
    end

  end
end
