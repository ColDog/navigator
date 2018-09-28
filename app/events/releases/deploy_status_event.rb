module Releases
  class DeployStatusEvent < ApplicationEvent

    schema do
      required(:deploy_uid).filled(:str?)
      required(:status).filled(:str?)
      optional(:error).filled(:str?)
    end

  end
end
