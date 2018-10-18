module Releases
  class DeleteCommand < ApplicationCommand

    def command
      params[:release_uid] = SecureRandom.uuid
      Releases::DeletedEvent.play(params)
    end

  end
end
