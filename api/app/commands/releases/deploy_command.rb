module Releases
  class DeployCommand < ApplicationCommand

    def execute
      params[:deploy_uid] = SecureRandom.uuid unless params[:deploy_uid]
      Releases::DeployEvent.play(params)
    end

  end
end
