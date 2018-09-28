module Apps
  class UpdatedEvent < ApplicationEvent
    fields :app_uid, :name

    schema do
      required(:app_uid).filled(:str?)
      required(:name).filled(:str?)
    end

  end
end
