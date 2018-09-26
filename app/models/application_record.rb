class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  SUBSCRIPTIONS = {}

  def self.subscribe(event, &block)
    SUBSCRIPTIONS[event.name] ||= []
    SUBSCRIPTIONS[event.name] << block
  end

end
