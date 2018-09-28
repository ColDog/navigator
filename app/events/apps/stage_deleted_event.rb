module Apps
  class StageDeletedEvent < ApplicationEvent
    fields :stage_uid

    schema do
      required(:stage_uid).filled(:str?)
    end

  end
end
