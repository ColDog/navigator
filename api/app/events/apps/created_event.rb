module Apps
  class CreatedEvent < ApplicationEvent
    fields :name, :app_uid

    schema do
      required(:name).filled(:str?)
      required(:app_uid).filled(:str?)
    end

  end
end
