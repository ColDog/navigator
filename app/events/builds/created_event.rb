module Builds
  class CreatedEvent < ApplicationEvent
    fields :build_uid, :app_uid, :stage_uid, :version, :values

    schema do
      required(:build_uid).filled(:str?)
      required(:app_uid).filled(:str?)
      required(:stage_uid).filled(:str?)
      required(:version).filled(:str?)
      required(:values).filled(:hash?)
    end

  end
end
