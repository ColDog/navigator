module Apps
  class DeleteCommand < ApplicationCommand
    SCHEMA = Dry::Validation.Schema do
      required(:id).filled(:str?)
    end

    def execute
      return false unless validate
      Apps::DeletedEvent.play(params)
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
