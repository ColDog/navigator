module Releases
  class StatusCommand < ApplicationCommand

    def command
      if params[:deploy_uid]
        Releases::DeployStatusEvent.play(params)
      else
        Releases::ReleaseStatusEvent.play(params)
      end
    end

  end
end
