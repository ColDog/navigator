module Apps
  class StageUpdatedEvent < ApplicationEvent
    fields :app_uid, :stage_uid, :name, :review, :auto, :promotion

    schema do
      required(:app_uid).filled(:str?)
      required(:stage_uid).filled(:str?)
      required(:name).filled(:str?)
      optional(:review).filled(:bool?)
      optional(:auto).filled(:bool?)
      optional(:promotion).filled(:bool?)
    end

  end
end
