module Builds
  class CreateCommand < ApplicationCommand
    SCHEMA = Dry::Validation.Schema do
      required(:name).filled(:str?)
      required(:version).filled(:str?)
      required(:values).filled(:hash?)
      required(:stage).filled(:str?)
    end

    def execute
      return false unless validate
      params[:id] = SecureRandom.uuid
      Builds::CreatedEvent.play(params)
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
