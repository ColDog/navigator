module Apps
  class ClusterCreatedEvent < ApplicationEvent
    fields :stage_uid, :cluster_uid, :name, :values

    schema do
      required(:stage_uid).filled(:str?)
      required(:cluster_uid).filled(:str?)
      required(:name).filled(:str?)
      optional(:values).filled(:hash?)
    end

  end
end
