class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  SUBSCRIPTIONS = {}

  def self.subscribe(event, &block)
    SUBSCRIPTIONS[event.name] ||= []
    SUBSCRIPTIONS[event.name] << block
  end

  after_initialize :generate_uuid

  protected

  def generate_uuid
    self.uid = SecureRandom.uuid unless self.uid
  end
end
