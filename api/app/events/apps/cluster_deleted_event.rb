module Apps
  class ClusterDeletedEvent < ApplicationEvent
    fields :cluster_uid

    schema do
      required(:cluster_uid).filled(:str?)
    end

  end
end
