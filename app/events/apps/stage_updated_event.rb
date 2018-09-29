module Apps
  class StageUpdatedEvent < ApplicationEvent
    fields :stage_uid, :name, :review, :auto, :promotion

    schema do
      required(:stage_uid).filled(:str?)
      required(:name).filled(:str?)
      optional(:review).filled(:bool?)
      optional(:auto).filled(:bool?)
      optional(:promotion).filled(:bool?)
    end

  end
end
