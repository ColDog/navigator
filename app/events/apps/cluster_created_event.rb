module Apps
  class ClusterCreatedEvent < ApplicationEvent
    fields :app_uid, :stage_uid, :cluster_uid, :name, :values

    schema do
      required(:app_uid).filled(:str?)
      required(:stage_uid).filled(:str?)
      required(:cluster_uid).filled(:str?)
      required(:name).filled(:str?)
      optional(:values).filled(:hash?)
    end

  end
end
