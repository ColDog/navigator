module Apps
  class CreateCommand < ApplicationCommand
    SCHEMA = Dry::Validation.Schema do
      required(:name).filled(:str?)
    end

    def execute
      return false unless validate
      params[:id] = SecureRandom.uuid
      Apps::CreatedEvent.play(params)
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
