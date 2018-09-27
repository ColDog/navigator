module Releases
  class DeployCommand < ApplicationCommand
    SCHEMA = Dry::Validation.Schema do
      required(:release_id).filled(:str?)
      required(:stage).filled(:str?)
    end

    def execute
      return false unless validate
      params[:id] = SecureRandom.uuid
      Releases::DeployEvent.play(params)
      true
    end

    def validate
      @errors = SCHEMA.call(params).messages
      return @errors.length == 0
    end

    def valid?
      @errors && @errors.length == 0
    end

  end
end
