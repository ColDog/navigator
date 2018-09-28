module Builds
  class CreateCommand < ApplicationCommand

    def command
      params[:build_uid] = SecureRandom.uuid
      Builds::CreatedEvent.play(params)
    end

  end
end
