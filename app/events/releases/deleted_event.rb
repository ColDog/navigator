module Releases
  class DeletedEvent < ApplicationEvent
    fields :target_release_uid, :release_uid

    schema do
      required(:target_release_uid).filled(:str?)
      required(:release_uid).filled(:str?)
    end

  end
end
