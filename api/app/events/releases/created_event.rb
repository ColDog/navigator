module Releases
  class CreatedEvent < ApplicationEvent
    fields :build_uid, :release_uid

    schema do
      required(:build_uid).filled(:str?)
      required(:release_uid).filled(:str?)
    end

  end
end
