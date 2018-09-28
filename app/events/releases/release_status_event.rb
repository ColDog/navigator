module Releases
  class ReleaseStatusEvent < ApplicationEvent

    schema do
      required(:release_uid).filled(:str?)
      required(:status).filled(:str?)
      optional(:error).filled(:str?)
    end

  end
end
