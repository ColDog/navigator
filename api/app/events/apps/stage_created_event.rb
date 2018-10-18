module Apps
  class StageCreatedEvent < ApplicationEvent
    fields :app_uid, :stage_uid, :name

    schema do
      required(:app_uid).filled(:str?)
      required(:stage_uid).filled(:str?)
      required(:name).filled(:str?)
    end

  end
end
