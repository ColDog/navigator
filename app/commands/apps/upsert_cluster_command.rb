module Apps
  class UpsertClusterCommand < ApplicationCommand

    def command
      if params[:cluster_uid]
        Apps::ClusterUpdatedEvent.play(params)
      else
        params[:cluster_uid] = SecureRandom.uuid
        Apps::ClusterCreatedEvent.play(params)
      end
    end

  end
end
