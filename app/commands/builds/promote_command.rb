module Builds
  class PromoteCommand < ApplicationCommand

    def command
      params[:build_uid] = SecureRandom.uuid
      Builds::PromotedEvent.play(params)
    end

  end
end
