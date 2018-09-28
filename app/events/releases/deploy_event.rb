module Releases
  class DeployEvent < ApplicationEvent
    fields :release_uid, :deploy_uid, :cluster_uid

    schema do
      required(:release_uid).filled(:str?)
      required(:deploy_uid).filled(:str?)
      required(:cluster_uid).filled(:str?)
    end

  end
end
