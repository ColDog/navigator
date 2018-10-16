class ApplicationJob < ActiveJob::Base
  # Automatically retry jobs that encountered a deadlock
  retry_on ActiveRecord::Deadlocked

  # Most jobs are safe to ignore if the underlying records are no longer available
  discard_on ActiveJob::DeserializationError

  SUBSCRIPTIONS = {}

  def self.subscribe(event, &block)
    puts "Subscribing #{self.name} to #{event.name}"
    SUBSCRIPTIONS[event.name] ||= []
    SUBSCRIPTIONS[event.name] << block
  end

end
