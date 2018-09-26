module Releases
  class StatusCommand < ApplicationCommand
    SCHEMA = Dry::Validation.Schema do
      required(:id).filled(:str?)
      required(:status).filled(:str?)
    end

    def execute
      return false unless validate
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
