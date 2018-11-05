class ApplicationSerializer
  attr_accessor :model

  def self.fields(*args)
    @fields ||= [:type]
    @fields = @fields + args if args
    @fields
  end

  def self.serialize(model)
    return nil unless model
    new(model).serialize
  end

  def initialize(model)
    @model = model
  end

  def type
    self.model.class.name.underscore
  end

  def serialize
    output = {}
    self.class.fields.each do |field|
      output[field] = self.respond_to?(field) ? self.send(field) : @model.send(field)
    end
    output.deep_transform_keys { |key| key.to_s.camelize(:lower) }
  end

end
