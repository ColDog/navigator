class Event < ApplicationRecord
  serialize :params
  validates_presence_of :name

  def event
    self.name.constantize.new(self.params, self.uid)
  end

  def self.play(name, params)
    event = self.create!(name: name, params: params)

    (ApplicationRecord::SUBSCRIPTIONS[event.name] || []).each do |subscriber|
      subscriber.call(event.event)
    end
    (ApplicationJob::SUBSCRIPTIONS[event.name] || []).each do |subscriber|
      subscriber.call(event.event)
    end
  rescue ActiveRecord::ActiveRecordError => e
    # puts "error - #{e}"
    self.create!(name: "#{name}::Cancelled", params: { error: e.message })
  end

end
