module Releases
  class ReleaseStatusEvent < ApplicationEvent
    fields :release_uid, :status, :error

    schema do
      required(:release_uid).filled(:str?)
      required(:status).filled(:str?)
      optional(:error)
    end

  end
end
