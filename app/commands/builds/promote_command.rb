module Builds
  class CreateCommand < ApplicationCommand

    def command
      Builds::PromotedEvent.play(params)
    end

  end
end
