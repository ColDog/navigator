class Event < ApplicationRecord
  serialize :params
  validates_presence_of :name

  def event
    self.name.constantize!.new(self.params)
  end

  def self.play(name, params)
    transaction do
      event = self.create!(name: name, params: params)
      (ApplicationRecord::SUBSCRIPTIONS[event.name] || []).each do |subscriber|
        subscriber.call(event)
      end
    end
  end

end
