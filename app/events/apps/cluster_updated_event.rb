module Apps
  class ClusterUpdatedEvent < ApplicationEvent
    fields :cluster_uid, :name, :values

    schema do
      required(:cluster_uid).filled(:str?)
      required(:name).filled(:str?)
      optional(:values).filled(:hash?)
    end

  end
end
