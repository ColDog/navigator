module Apps
  class DeletedEvent < ApplicationEvent
    fields :app_uid

    schema do
      required(:app_uid).filled(:str?)
    end

  end
end
