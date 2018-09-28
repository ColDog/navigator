module Releases
  class CreateCommand < ApplicationCommand

    def command
      params[:release_uid] = SecureRandom.uuid
      Releases::CreatedEvent.play(params)
    end

  end
end
