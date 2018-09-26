class ApplicationEvent
  attr_reader :params

  def initialize(params)
    @params = params
  end

  def self.play(params)
    self.new(params).play
  end

  def play
    Event.play(name, params)
  end

  def name
    self.class.name
  end

end
