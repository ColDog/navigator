module Releases
  class DeployStatusEvent < ApplicationEvent
    fields :deploy_uid, :status, :error

    schema do
      required(:deploy_uid).filled(:str?)
      required(:status).filled(:str?)
      optional(:error)
    end

  end
end
