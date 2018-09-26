module Releases
  class CreateCommand < ApplicationCommand
    SCHEMA = Dry::Validation.Schema do
      required(:build_id).filled(:str?)
    end

    def execute
      return false unless validate
      params[:id] = SecureRandom.uuid
      Releases::CreatedEvent.play(params)
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
