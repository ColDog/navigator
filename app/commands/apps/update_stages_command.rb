module Apps
  class UpdateStagesCommand < ApplicationCommand
    # Example input:
    # id: <uuid>
    # stages:
    # - name: review
    #   review: true
    #   auto: true
    # - name: staging
    #   auto: true
    #   promotion: true
    # - name: production
    #   clusters:
    #   - name: production-west
    #     values: {}
    #   - name: production-east
    #     values: {}
    SCHEMA = Dry::Validation.Schema do
      required(:id).filled(:str?)
      required(:stages).each do
        schema do
          required(:name).filled(:str?)
          optional(:review).filled(:bool?)
          optional(:auto).filled(:bool?)
          optional(:promotion).filled(:bool?)
          required(:clusters).each do
            schema do
              required(:name).filled(:str?)
              required(:values).filled(:hash?)
            end
          end
        end
      end
    end

    def execute
      return false unless validate
      Apps::UpdatedEvent.play(params)
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
