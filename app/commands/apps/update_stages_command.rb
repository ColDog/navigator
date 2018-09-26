module Apps
  class UpdateStagesCommand < ApplicationCommand
    # Example input:
    # id: <uuid>
    # stages:
    #   - name: review
    #     environment: staging
    #     review: true
    #     auto: true
    #   - name: staging
    #     environment: staging
    #     auto: true
    #     promotion: true
    #   - name: production
    #     environment: production
    SCHEMA = Dry::Validation.Schema do
      required(:id).filled(:str?)
      required(:stages).each do
        schema do
          required(:name).filled(:str?)
          required(:environment).filled(:str?)
          optional(:review).filled(:bool?)
          optional(:auto).filled(:bool?)
          optional(:promotion).filled(:bool?)
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
